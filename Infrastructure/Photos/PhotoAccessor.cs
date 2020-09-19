using System;
using Application.Interfaces;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos
{
    public class PhotoAccessor: IPhotoAccessor
    {
        // create a private cloudinary field
        private readonly Cloudinary _cloudinary;
        
        public PhotoAccessor(IOptions<CloudinarySettings> config)
        {
            // initialize a new cloudinary instance with the url gotten from the webpage
            _cloudinary = new Cloudinary("cloudinary://351243614951183:yaHfOEa8Rpxvi03JrSpnHbLDY1Y@dbankx");
        }
        public PhotoUploadResult AddPhoto(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();
            // check file isint empty
            if (file.Length > 0)
            {
                // create a file stream and upload the file to cloudinary
                using (var filestream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(file.FileName, filestream),                        // setting the trasnformation **optional** 
                        Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
                    };

                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            // if there is an error in uploading the photo send an error
            if (uploadResult.Error != null)
            {
                throw new Exception(uploadResult.Error.Message);
            }
            
            // return a photo upload result object
            return new PhotoUploadResult
            {
                PublicId = uploadResult.PublicId,
                Url = uploadResult.SecureUrl.AbsoluteUri
            };
        }

        public string DeletePhoto(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            var result = _cloudinary.Destroy(deleteParams);
            return result.Result == "ok" ? result.Result : null;
        }
    }
}