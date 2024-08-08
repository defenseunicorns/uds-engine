#!/bin/bash -x

# Get instance public IP
public_ip="$(curl -s https://checkip.amazonaws.com/)"

# Create k3d cluster
# k3d cluster create uds \
#     --api-port 6443 \
#     --port 80:80@loadbalancer \
#     --port 443:443@loadbalancer \
#     --k3s-arg "--tls-san=$public_ip@server:*"

# Build and Deploy Bundle
cat <<EOF > /tmp/uds-bundle.yaml
    kind: UDSBundle
    metadata:
      name: runtime-test
      description: A UDS bundle for deploying UDS Runtime with UDS Core

    packages:
      - name: uds-k3d-dev
        repository: ghcr.io/defenseunicorns/packages/uds-k3d
        ref: 0.8.0

      - name: init
        repository: ghcr.io/defenseunicorns/packages/init
        ref: v0.35.0

      - name: core
        repository: ghcr.io/defenseunicorns/packages/uds/core
        ref: 0.25.0-upstream
        optionalComponents:
          - istio-passthrough-gateway
          - metrics-server
        overrides:
          keycloak:
            keycloak:
              values:
                - path: realmInitEnv
                  value:
                    GOOGLE_IDP_ENABLED: true
                    GOOGLE_IDP_ID: "C01881u7t"
                    GOOGLE_IDP_SIGNING_CERT: "MIIDdDCCAlygAwIBAgIGAXkza8/+MA0GCSqGSIb3DQEBCwUAMHsxFDASBgNVBAoTC0dvb2dsZSBJbmMuMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MQ8wDQYDVQQDEwZHb29nbGUxGDAWBgNVBAsTD0dvb2dsZSBGb3IgV29yazELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWEwHhcNMjEwNTAzMTgwOTMzWhcNMjYwNTAyMTgwOTMzWjB7MRQwEgYDVQQKEwtHb29nbGUgSW5jLjEWMBQGA1UEBxMNTW91bnRhaW4gVmlldzEPMA0GA1UEAxMGR29vZ2xlMRgwFgYDVQQLEw9Hb29nbGUgRm9yIFdvcmsxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu9en1CO4EriCJ5jzss6TqUmtYMXXRBfsSkdnhVvMx0fYOegxy0d8DouUEEITlPW+YPBG1T72kiV9KGtKVw90ff4Y+siNDNrME81w4K3Zjo6VukvATfD05lVzh9JyO0VxdzBpdRXSJqBOVLo38cwVbyTcX5Nk/nHENjDSN7as3UvbXa7eT4Xswy1GARGAZ3MAaLTZn1+Cctn0MDKniQOS6QDryYgKWz8ko/H4T9XCxgjHJVsL6obezaPZF+pibyyVPCuePssuxUbFHF6yiP5rCfAsK6VTv/8pbYGauGpYHDgnM941RtN2ThltORgi+P9i9wQ8VRBQpEm1RvDXOqJ7OwIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQB5L26tpco6EgVunmZYBAFiFE+Dhqwvy4J1iKuXApaKhqabeKJ8kBv/pJBnZl7CRF5Pv8dLfhNoNm2BsXbpH91/rhDj9zl/Imkc5ttVGbXbKSBpUaduwBZpsVIX0xCugNPflHFz9kf/zsGWb3X6wO/2eNewj3fr8jNRC/KWQ7otcdqwYbe1BO4yo6FjAIs5L+wCQcc2JjRWgBon4wL25ccX3nH8aMHl4/gz5trKwPqH0/lYcScJmMSRPzHbmd62LlmZE9eWEwuYJ+h8fssTZA9JTMXvkPhg05w2snaM9XdSuXIRo4UtqGpMQC0KRMmwDHbVSluX63wn7iSZD4TGHZGa"
                    GOOGLE_IDP_NAME_ID_FORMAT: "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified"
                    GOOGLE_IDP_CORE_ENTITY_ID: "https://sso.uds.dev/realms/uds"
                    GOOGLE_IDP_ADMIN_GROUP: "uds-core-dev-admin"
                    GOOGLE_IDP_AUDITOR_GROUP: "uds-core-dev-auditor"

      - name: runtime
        repository: ghcr.io/defenseunicorns/packages/uds/uds-runtime
        ref: nightly-unstable
EOF

uds create /tmp --confirm -o /tmp
uds deploy /tmp/uds-bundle-runtime-test-*.tar.zst --confirm
