# AuthenticationExample

Simple example of an passthrough authentication scheme.

Credentials are AES encrypted and provided back via an HTTP Only cookie,

The credential are only valid as long as the server is running, as this relies on a cookie the token is transparently passed around for all requests.
