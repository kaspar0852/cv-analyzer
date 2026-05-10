namespace UploadService.Application.Services.FileStorageService;

public interface IFileStorageService
{
    Task<string> UploadAsync(Stream stream, string fileName, string contentType);

    Task<Stream> DownloadAsync(string objectName);

    Task DeleteAsync(string objectName);
}