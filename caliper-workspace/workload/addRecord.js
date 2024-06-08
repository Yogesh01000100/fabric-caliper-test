'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');
const crypto = require('crypto');

class EHRWorkload extends WorkloadModuleBase {
    constructor() {
        super();
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);

        for (let i = 0; i < this.roundArguments.assets; i++) {
            const patientId = `PATIENT_${workerIndex}_${roundIndex}_${i}`;
            const ipfsHash = crypto.randomBytes(20).toString('hex');
            console.log(`Worker ${workerIndex}: Uploading EHR for patient ${patientId}`);
            const request = {
                contractId: this.roundArguments.contractId,
                contractFunction: 'UploadEHR',
                invokerIdentity: 'Admin',
                contractArguments: [patientId, ipfsHash],
                readOnly: false
            };

            await this.sutAdapter.sendRequests(request);
        }
    }

    async submitTransaction() {
        const patientId = `PATIENT_${this.workerIndex}_${Date.now()}`;
        const ipfsHash = crypto.randomBytes(20).toString('hex');
        const request = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'UploadEHR',
            invokerIdentity: 'Admin',
            contractArguments: [patientId, ipfsHash],
            readOnly: false
        };

        await this.sutAdapter.sendRequests(request);
    }
}

function createWorkloadModule() {
    return new EHRWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
