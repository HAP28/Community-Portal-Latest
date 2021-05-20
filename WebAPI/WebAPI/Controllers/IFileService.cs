using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace WebAPI.Controllers
{
    public interface IFileService
    {
        void UploadFile(List<IFormFile> files, string subDirectory);
        string SizeConverter(long bytes);
    }
}
