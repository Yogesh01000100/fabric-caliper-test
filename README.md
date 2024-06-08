## caliper-workspace

npm install --only=prod @hyperledger/caliper-cli@0.6.0

npx caliper bind --caliper-bind-sut fabric:fabric-gateway

npx caliper launch manager --caliper-workspace ./ --caliper-networkconfig networks/networkConfig.yaml --caliper-benchconfig benchmarks/uploadehr.yaml


## tape-directory
./tape-Linux-X64 commitOnly --config=config.yaml --number=100