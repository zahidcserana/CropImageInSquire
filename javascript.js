cLeaping.Account_profile = function () {
    var cropper;
    var div2Width;
    var imageWidth;
    var imageHeight;
    if (CKEDITOR) {
        CKEDITOR.replace('bio');
    }
    $("#change_picture").click(function () {
        $("#imageFile").click();
    });
    $("#picture_change").click(function () {
        $("#imageFile").click();
    });
    $("#imageFile").change(function () {
        console.log('cropper created');
        var _URL = window.URL || window.webkitURL;
        img = new Image();
        img.onerror = function () {
            alert('Please chose an image file!');
        };
        img.onload = function () {

            var imageWidth = this.width;
            var imageHeight = this.height;
            //console.log('imageWidth');
            //console.log(imageWidth);
            $("#image_width").val(imageWidth);
            $("#image_height").val(imageHeight);

            $("#imageCropped").hide();
            $('#image_upload').attr('src', this.src);
            $("#image-div1").show();
            $("#change_picture").hide();
            $("#back").hide();
            $("#save").hide();
            $("#discard").show();
            $("#getCroppedImage").show();
            $('#modalChangePicture').modal('show');
        };
        img.src = _URL.createObjectURL(this.files[0]);
    });

    $("#getCroppedImage").click(function () {
        var imageSrc = cropper.getCroppedCanvas().toDataURL('image/jpeg');
        $("#image-div1").hide();
        $("#imageCropped").show();
        $("#imageCropped").attr('src', imageSrc);

        $("#save").show();
        $("#discard").show();
        $("#back").show();
        $("#change_picture").hide();
        //$("#imag-canvas").hide();
        $("#getCroppedImage").hide();

    });

    $("#save").click(function () {
        $(".progress").show();
        /*var userId = <?php echo json_encode($user['id']);?>;*/
        var img = document.getElementById('imageFile');
        var cropedImg = $('#imageCropped').attr('src');
        $('#base_image').attr('src', cropedImg);
        var CSRF_TOKEN = "{{ csrf_token() }}";
        var data = new FormData();
        data.append('file', img.files[0]);
        data.append('cropedImageContent', cropedImg);
        //data.append('userId', userId);
        data.append('_token', CSRF_TOKEN);
        var Url = "/accounts/change_image";

        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', function (ev) {
            var progress = parseInt(ev.loaded / ev.total * 100);
            $('#progressBar').css('width', progress + '%');
            $('#progressBar').html(progress + '%');
        }, false);
        xhr.onreadystatechange = function (ev) {
            //console.log(xhr.readyState);
            if (xhr.readyState == 4) {
                if (xhr['status'] = '200') {
                    $("#imageCropped").hide();
                    $(".progress").hide();
                    $("#save").hide();
                    $("#back").hide();
                    $("#discard").hide();
                    $("#getCroppedImage").hide();
                    $('#progressBar').css('width', '0' + '%');
                    $('#progressBar').html('0' + '%');
                    $('#modalChangePicture').modal('hide');
                }

            }
        };
        xhr.open('POST', Url, true);
        xhr.send(data);
        return false;
    });

    $("#back").click(function () {
        $("#image-div1").show();
        $("#imageCropped").hide();
        $("#discard").show();
        $("#getCroppedImage").show();
        $("#save").hide();
        $("#back").hide();
        $("#change_picture").hide();

    });

    $("#discard").click(function () {
        $('#modalChangePicture').modal('hide');
    });

    $("#modalChangePicture").on('hidden.bs.modal', function () {
        //console.log('hide modal');
        cropper.destroy();
        $("#imageFile").val("");
    });

    $('#modalChangePicture').on('shown.bs.modal', function () {

        //console.log('sho9wing');
        var div2Width = $("#upImage").width();
        var div2Height = $("#upImage").height();
        var imageWidth = $("#image_width").val();
        var imageHeight = $("#image_height").val();
        console.log("height:");
        console.log(imageHeight);
        console.log("height:");
        //console.log(imageWidth);
        //console.log("width:");
        if (imageHeight < 800) {
            $(this).find('.modal-body').css({
                width: 'auto', //probably not needed
                height: 'auto', //probably not needed
                'min-height': parseInt(imageHeight) + 500
            });
        } else {
            $(this).find('.modal-body').css({
                width: 'auto', //probably not needed
                height: 'auto', //probably not needed
                'min-height': parseInt(imageHeight)
            });
        }


        if (imageWidth < div2Width) {
            //document.getElementById('image-div1').style.width = imageWidth;


        }
        if (imageHeight < div2Height) {
            //document.getElementById('image-div1').style.height = imageHeight;

        }
        var image = document.getElementById('image_upload');

        cropper = new Cropper(image, {
            aspectRatio: 1,
            crop: function (e) {
                /*console.log(e.detail.x);
                console.log(e.detail.y);
                console.log(e.detail.width);
                console.log(e.detail.height);
                console.log(e.detail.rotate);
                console.log(e.detail.scaleX);
                console.log(e.detail.scaleY);*/
            }
        });
    });

    $('#change_password').validate({
        onkeyup: false,
        onfocusout: false,
        errorElement: 'p',
        rules: {
            password: 'required',
            npassword: 'required',
            cpassword: {
                required: true,
                equalTo: '#npassword'
            }
        },
        messages: {
            password: {
                required: 'Old Password is required',
            },
            npassword: {
                required: 'New Password is required',
            },
            cpassword: {
                required: 'Please re enter the password',
                equalTo: 'Password does\'t match'
            }
        },
        submitHandler: function () {
            $.ajax({
                type: "POST",
                url: "/accounts/change_password",
                data: $('#change_password').serialize(),
                cache: false,
                success: function (data) {
                    data = JSON.parse(data);
                    console.log(data.success);
                    if (data.success == '1' || data.success == 1) {
                        $('.success').html('<p class="alert alert-success"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' + data.message + '</p>');

                    } else {
                        $('.success').html('<p class="alert alert-success"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' + data.message + '</p>')
                    }

                }
            });
        }
    })

}