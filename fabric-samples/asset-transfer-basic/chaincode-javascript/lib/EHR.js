'use strict';
const { Contract } = require('fabric-contract-api');
const sortKeysRecursive = require('sort-keys-recursive');
const stringify = require('json-stringify-deterministic');

class EHRContract extends Contract {

    async initLedger(ctx) {
        const hospitalData = [
            {
                id: 'HOSP1001', // HOSP1002 FOR NET-2
                name: 'Sunrise Health Medical Center',
                address: {
                    street: '2500 Wellness Way',
                    city: 'Healville',
                    state: 'HS',
                    zipCode: '12345',
                },
                contact: {
                    phone: '123-456-7890',
                    fax: '123-456-7891',
                    email: 'info@sunrisehealthmc.com',
                },
                departments: [
                    'Emergency',
                    'Cardiology',
                    'Neurology',
                    'Pediatrics',
                    'Oncology',
                ],
                services: [
                    '24/7 Emergency Services',
                    'Heart and Vascular Care',
                    'Comprehensive Stroke Center',
                    'Children’s Health Services',
                    'Cancer Treatment and Research',
                ],
                facilities: [
                    'State-of-the-art Operating Rooms',
                    'Advanced Imaging Center',
                    'Family Birthing Suites',
                    'Pediatric Intensive Care Unit',
                    'Dedicated Oncology Ward',
                ],
            },
        ];

        for (const record of hospitalData) {
            await ctx.stub.putState(record.id, Buffer.from(JSON.stringify(record)));
            console.info(`Hospital record ${record.id} initialized`);
        }
    }

    async UploadEHR(ctx, patientId, ipfsHash) {
        const patientKey = `patient_${patientId}`;
        const exists = await this.UserExists(ctx, patientKey);
        if (exists) {
            throw new Error(`The patient with ID ${patientId} already exists`);
        }

        const ehrData = {
            ID: patientId,
            IPFSHash: ipfsHash
        };

        const sortedEhrData = sortKeysRecursive(ehrData);

        await ctx.stub.putState(patientKey, Buffer.from(stringify(sortedEhrData)));
        return JSON.stringify(ehrData);
    }

    async FetchEHR(ctx, patientId) {
        const patientKey = `patient_${patientId}`;
        const ehrBuffer = await ctx.stub.getState(patientKey);
        if (!ehrBuffer || ehrBuffer.length === 0) {
            throw new Error(`No EHR data found for patient ID: ${patientId}`);
        }
    
        const ehrData = JSON.parse(ehrBuffer.toString());
        return JSON.stringify(ehrData);
    }
    
    async FetchAllRecords(ctx) {
        const startKey = 'patient_000';
        const endKey = 'patient_99999';
    
        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
        const results = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                let record = JSON.parse(res.value.value.toString('utf8'));
                results.push(record);
            }
            if (res.done) {
                await iterator.close();
                break;
            }
        }
    
        return JSON.stringify(results);
    }

    async UserExists(ctx, key) {
        const record = await ctx.stub.getState(key);
        return !!record && record.length > 0;
    }
}

module.exports = EHRContract;