using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace WebAPI.Controllers
{
    public interface IFileService
    {
        void UploadFile(List<IFormFile> files, string subDirectory);
        string SizeConverter(long bytes);
    }
}
