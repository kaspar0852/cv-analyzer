using Minio;
using Minio.DataModel.Args;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading.Tasks;

namespace ParserService.Infrastructure.Services
{
    public interface IFileStorageService
    {
        Task<Stream> DownloadAsync(string objectName);
    }

    public class FileStorageService : IFileStorageService
    {
        private readonly ILogger<FileStorageService> _logger;
        private readonly IMinioClient _minioClient;
        private readonly string _bucketName;

        public FileStorageService(ILogger<FileStorageService> logger, IConfiguration configuration)
        {
            _logger = logger;
            _bucketName = configuration["Minio:BucketName"] ?? throw new ArgumentNullException("Minio:BucketName configuration is missing");

            try
            {
                _minioClient = new MinioClient()
                    .WithEndpoint(configuration["Minio:Endpoint"])
                    .WithCredentials(
                        configuration["Minio:AccessKey"],
                        configuration["Minio:SecretKey"])
                    .Build();
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, "Failed to initialize Minio client.");
                throw;
            }
        }

        public async Task<Stream> DownloadAsync(string objectName)
        {
            if (string.IsNullOrWhiteSpace(objectName)) throw new ArgumentException("Object name cannot be empty", nameof(objectName));

            try
            {
                _logger.LogInformation("Downloading object {ObjectName} from bucket {BucketName}", objectName, _bucketName);

                var memoryStream = new MemoryStream();

                await _minioClient.GetObjectAsync(
                    new GetObjectArgs()
                        .WithBucket(_bucketName)
                        .WithObject(objectName)
                        .WithCallbackStream(stream =>
                        {
                            stream.CopyTo(memoryStream);
                        }));

                memoryStream.Position = 0;
                return memoryStream;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error downloading object {ObjectName} from Minio", objectName);
                throw new Exception($"Failed to download file from storage: {ex.Message}", ex);
            }
        }
    }
}
