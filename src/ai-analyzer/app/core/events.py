import json
import logging
import pika
import asyncio
from app.core.config import settings
from app.services.ai_service import ai_service

logger = logging.getLogger("AIAnalyzer")

class EventBus:
    def __init__(self):
        self.credentials = pika.PlainCredentials(settings.RABBITMQ_USER, settings.RABBITMQ_PASS)
        self.connection_params = pika.ConnectionParameters(
            host=settings.RABBITMQ_HOST, 
            credentials=self.credentials,
            heartbeat=600
        )

    def publish_completion(self, upload_id: str, score: int, industry: str, name: str):
        """Publishes a lightweight summary event for other services to consume."""
        try:
            connection = pika.BlockingConnection(self.connection_params)
            channel = connection.channel()
            
            exchange_name = settings.COMPLETION_EVENT
            channel.exchange_declare(exchange=exchange_name, exchange_type='fanout', durable=True)
            
            message = {
                "message": {
                    "uploadId": upload_id,
                    "overallScore": score,
                    "industry": industry,
                    "candidateName": name,
                    "status": "Completed"
                },
                "messageType": [f"urn:message:{settings.COMPLETION_EVENT}"]
            }
            
            channel.basic_publish(
                exchange=exchange_name,
                routing_key='',
                body=json.dumps(message),
                properties=pika.BasicProperties(content_type='application/json')
            )
            logger.info(f"Published lightweight summary event for {upload_id}")
            connection.close()
        except Exception as e:
            logger.error(f"Failed to publish event: {e}")

    def start_consuming(self):
        while True:
            try:
                logger.info(f"Connecting to RabbitMQ at {settings.RABBITMQ_HOST}...")
                connection = pika.BlockingConnection(self.connection_params)
                channel = connection.channel()

                channel.exchange_declare(exchange=settings.RAW_TEXT_EVENT, exchange_type='fanout', durable=True)
                
                queue_name = "ai-analyzer-queue"
                channel.queue_declare(queue=queue_name, durable=True)
                channel.queue_bind(exchange=settings.RAW_TEXT_EVENT, queue=queue_name)

                channel.basic_qos(prefetch_count=1)
                
                def callback(ch, method, properties, body):
                    try:
                        logger.info(f"--- MESSAGE RECEIVED ON QUEUE ---")
                        data = json.loads(body)
                        message = data.get("message", data)
                        upload_id = message.get("uploadId")
                        raw_text = message.get("rawText")
                        
                        if upload_id and raw_text:
                            logger.info(f"Processing CV for UploadId: {upload_id}")
                            
                            # Run multi-stage async pipeline (returns a dict now)
                            pipeline_result = asyncio.run(ai_service.analyze_cv_pipeline(raw_text, upload_id))
                            
                            if "error" not in pipeline_result:
                                # Extract summary for the event (force int for .NET compatibility)
                                try:
                                    score = int(float(pipeline_result.get("scoring_results", {}).get("overallScore", 0)))
                                except (ValueError, TypeError):
                                    score = 0
                                industry = pipeline_result.get("role_context", {}).get("primaryIndustry", "Unknown")
                                name = pipeline_result.get("structured_data", {}).get("personalInfo", {}).get("name", "Unknown")
                                
                                # Publish the lightweight event
                                self.publish_completion(upload_id, score, industry, name)
                            else:
                                logger.error(f"Pipeline failed for {upload_id}: {pipeline_result['error']}")
                        
                        ch.basic_ack(delivery_tag=method.delivery_tag)
                    except Exception as e:
                        logger.error(f"Error in callback: {e}")
                        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)

                channel.basic_consume(queue=queue_name, on_message_callback=callback)
                logger.info("RabbitMQ Consumer started.")
                channel.start_consuming()
            except Exception as e:
                logger.error(f"RabbitMQ Connection failed: {e}. Retrying in 5s...")
                import time
                time.sleep(5)

event_bus = EventBus()
