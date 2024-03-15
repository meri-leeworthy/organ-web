chown -R 991:991 /data
mkdir /data/appservices
cp /as/relay.yml /data/appservices/relay.yml
echo -e "\napp_service_config_files:\n  - /data/appservices/relay.yml" >> data/homeserver.yaml 