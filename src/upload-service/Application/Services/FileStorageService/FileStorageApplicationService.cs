using Minio;
using Minio.DataModel.Args;

namespace UploadService.Application.Services.FileStorageService;

public class FileStorageApplicationService : IFileStorageService
{
    private readonly ILogger<FileStorageApplicationService> _logger;
    private readonly IMinioClient _minioClient;
    private string _bucketName;

    public FileStorageApplicationService(ILogger<FileStorageApplicationService> logger, IConfiguration configuration)
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

    public async Task<string> UploadAsync(Stream stream, string fileName, string contentType)
    {
        if (stream == null) throw new ArgumentNullException(nameof(stream));
        if (string.IsNullOrWhiteSpace(fileName)) throw new ArgumentException("Filename cannot be empty", nameof(fileName));

        try
        {
            _logger.LogInformation("Uploading file {FileName} to bucket {BucketName}", fileName, _bucketName);

            var objectName = $"{Guid.NewGuid()}-{fileName}";

            var beArgs = new BucketExistsArgs().WithBucket(_bucketName);
            bool found = await _minioClient.BucketExistsAsync(beArgs);

            if (!found)
            {
                _logger.LogInformation("Bucket {BucketName} not found, creating it.", _bucketName);
                await _minioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(_bucketName));
            }

            await _minioClient.PutObjectAsync(
                new PutObjectArgs()
                    .WithBucket(_bucketName)
                    .WithObject(objectName)
                    .WithStreamData(stream)
                    .WithObjectSize(stream.Length)
                    .WithContentType(contentType));

            _logger.LogInformation("Successfully uploaded {FileName} as {ObjectName}", fileName, objectName);
            return objectName;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file {FileName} to Minio", fileName);
            throw new Exception($"Failed to upload file to storage: {ex.Message}", ex);
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

    public async Task DeleteAsync(string objectName)
    {
        if (string.IsNullOrWhiteSpace(objectName)) throw new ArgumentException("Object name cannot be empty", nameof(objectName));

        try
        {
            _logger.LogInformation("Deleting object {ObjectName} from bucket {BucketName}", objectName, _bucketName);

            await _minioClient.RemoveObjectAsync(
                new RemoveObjectArgs()
                    .WithBucket(_bucketName)
                    .WithObject(objectName));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting object {ObjectName} from Minio", objectName);
            throw new Exception($"Failed to delete file from storage: {ex.Message}", ex);
        }
    }
}