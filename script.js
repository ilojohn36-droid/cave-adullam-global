const SUPABASE_URL =
    "https://ktwvbhdxszxmmmfoxzra.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_MysGHP42nsPZzFzp2aBR-g_VhFE0Idq";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

document
    .getElementById("registrationForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            /* =================================
               GET FORM VALUES
            ================================= */

            const firstName =
                document
                    .getElementById("first_name")
                    .value
                    .trim();

            const lastName =
                document
                    .getElementById("last_name")
                    .value
                    .trim();

            const gender =
                document
                    .getElementById("gender")
                    .value;

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const phone =
                document
                    .getElementById("phone")
                    .value
                    .trim();

            const residentialCityState =
                document
                    .getElementById("residential_city_state")
                    .value
                    .trim();

            const churchName =
                document
                    .getElementById("church_name")
                    .value
                    .trim();

            const churchPosition =
                document
                    .getElementById("church_position")
                    .value
                    .trim();

            const howHeard =
                document
                    .getElementById("how_heard")
                    .value;

            const expectations =
                document
                    .getElementById("expectations")
                    .value
                    .trim();

            const attendanceType =
                document
                    .getElementById("attendance_type")
                    .value;

            const consentGiven =
                document
                    .getElementById("consent_given")
                    .checked;


            /* =================================
               CHECK CONSENT
            ================================= */

            if (!consentGiven) {

                alert(
                    "Please confirm your consent before submitting the form."
                );

                return;

            }


            /* =================================
               CREATE FULL NAME
            ================================= */

            const name =
                `${firstName} ${lastName}`.trim();


            /* =================================
               GENERATE REGISTRATION CODE
            ================================= */

            const randomPart =
                Math.random()
                    .toString(36)
                    .substring(2, 8)
                    .toUpperCase();

            const registrationCode =
                "CONF26-" + randomPart;


            /* =================================
               DISABLE BUTTON
            ================================= */

            const submitButton =
                document.querySelector(
                    "#registrationForm button[type='submit']"
                );

            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Registering...";

            }


           
/* =================================
   SAVE ATTENDEE
================================= */

try {
    const { error } = await supabaseClient
        .from("attendees")
        .insert([{
            name: name,
            email: email,
            phone: phone,
            institution: churchName,
            registration_code: registrationCode,
            checked_in: false,
            check_in_time: null,
            first_name: firstName,
            last_name: lastName,
            gender: gender,
            residential_city_state: residentialCityState,
            church_name: churchName,
            church_position: churchPosition,
            how_heard: howHeard,
            expectations: expectations,
            attendance_type: attendanceType,
            consent_given: consentGiven
        }]);

    /* =================================
       HANDLE ERRORS
    ================================= */

    if (error) {
        console.error("Supabase error:", error);

        const errorText =
            `${error.message || ""} ${error.details || ""}`;

        const isDuplicateEmail =
            error.code === "23505" &&
            errorText.includes(
                "attendees_email_unique_normalized_idx"
            );

        if (isDuplicateEmail) {
            alert(
                "Email Already Registered!\n\n" +
                "This email address has already been used " +
                "to register for JESUS 2026. Please use the " +
                "email address you registered with."
            );
        } else {
            alert(
                "Registration could not be completed. " +
                "Please check your details and try again."
            );
        }

        return;
    }

    /* =================================
       SAVE REGISTRATION FOR SUCCESS PAGE
    ================================= */

    sessionStorage.setItem(
        "jesus2026Registration",
        JSON.stringify({
            name: name,
            email: email,
            phone: phone,
            institution: churchName,
            registration_code: registrationCode
        })
    );

    /* =================================
       SUCCESS
    ================================= */

    window.location.href =
        "registration-success.htm?code=" +
        encodeURIComponent(registrationCode);

} catch (err) {
    console.error("Registration request failed:", err);

    alert(
        "We could not complete your registration because " +
        "of a connection or unexpected error. Please try again."
    );

} finally {
    /* Always restore the button if registration fails */
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Register for Conference";
    }
}
        }
    );

