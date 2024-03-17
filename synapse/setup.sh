echo "Setting permissions on /data"
chown -R 991:991 /data
echo "Putting relay.yml in /data/appservices"
mkdir /data/appservices
cp /as/relay.yml /data/appservices/relay.yml
echo "Configuring homeserver.yaml to use relay.yml"
echo -e "\napp_service_config_files:\n  - /data/appservices/relay.yml" >> data/homeserver.yaml 
echo "Done setting up appservices."