(() => {
    $('#profile-icon').on("click", function () {
        if ($('#my-profile-div').css('display') == "none"){
            $('#my-profile-div').show();
        }
        else {
            $('#my-profile-div').hide();
        }
    });
    $('#menu-arrow-collapse').on("click", function () {
        $('#my-profile-div').hide();
    });
    $('#role').on("change", function () {
        let value = $('#role').val();
        if (value === "Student"){
            $('#subject-menu').hide();
            $('#class-menu').show();
        }
        else if (value === "Teacher"){
            $('#class-menu').hide();
            $('#subject-menu').show();
        }
    });
})();
