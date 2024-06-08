sudo caliper launch manager --caliper-benchconfig ./fabric-samples/backend/backend-service/config/uploadehr.yaml --caliper-networkconfig ./fabric-samples/backend/backend-service/config/networkconfig.yaml --caliper-logging-level debug

./tape-Linux-X64 commitOnly --config=config.yaml --number=100