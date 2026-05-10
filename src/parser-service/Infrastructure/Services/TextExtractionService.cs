using System;
using System.IO;
using System.Text;
using UglyToad.PdfPig;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.Extensions.Logging;

namespace ParserService.Infrastructure.Services
{
    public interface ITextExtractionService
    {
        string ExtractText(Stream stream, string contentType);
    }

    public class TextExtractionService : ITextExtractionService
    {
        private readonly ILogger<TextExtractionService> _logger;

        public TextExtractionService(ILogger<TextExtractionService> logger)
        {
            _logger = logger;
        }

        public string ExtractText(Stream stream, string contentType)
        {
            try
            {
                if (contentType.Contains("pdf"))
                {
                    return ExtractFromPdf(stream);
                }
                else if (contentType.Contains("word") || contentType.Contains("officedocument"))
                {
                    return ExtractFromDocx(stream);
                }
                
                throw new NotSupportedException($"Content type {contentType} is not supported for text extraction.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error extracting text from file with content type {ContentType}", contentType);
                throw;
            }
        }

        private string ExtractFromPdf(Stream stream)
        {
            var sb = new StringBuilder();
            using (var document = PdfDocument.Open(stream))
            {
                foreach (var page in document.GetPages())
                {
                    sb.AppendLine(page.Text);
                }
            }
            return sb.ToString();
        }

        private string ExtractFromDocx(Stream stream)
        {
            var sb = new StringBuilder();
            using (var wordDoc = WordprocessingDocument.Open(stream, false))
            {
                var body = wordDoc.MainDocumentPart?.Document.Body;
                if (body != null)
                {
                    foreach (var paragraph in body.Elements<Paragraph>())
                    {
                        sb.AppendLine(paragraph.InnerText);
                    }
                }
            }
            return sb.ToString();
        }
    }
}
