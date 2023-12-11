add_action('rest_api_init', function () {
    register_rest_route('myapp/v1', '/login/', array(
        'methods' => 'POST',
        'callback' => 'custom_user_login_function',
    ));
});

function custom_user_login_function(WP_REST_Request $request) {
    $username_or_email = sanitize_text_field($request->get_param('username_or_email'));
    $password = $request->get_param('password');

    // Determine if the provided credential is a username or email.
    if (strpos($username_or_email, '@') !== false) {
        // The provided credential is an email address.
        $user = get_user_by('email', $username_or_email);
    } else {
        // The provided credential is a username.
        $user = get_user_by('login', $username_or_email);
    }

    if (!$user || is_wp_error($user)) {
        return new WP_Error('authentication_failed', 'Authentication failed', array('status' => 401));
    }

    // Use WordPress authentication functions to log in the user.
    $user = wp_authenticate_username_password(null, $username_or_email, $password);

    if (is_wp_error($user)) {
        return new WP_Error('authentication_failed', 'Authentication failed', array('status' => 401));
    }

    // Log the user in.
    wp_set_current_user($user->ID);
    wp_set_auth_cookie($user->ID);

    return new WP_REST_Response(array('message' => 'Authentication successful'), 200);
}
