import './setup.js';
import { expect } from 'chai';
import supertest from 'supertest';
import app from '../src/app.js';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import { UserModel } from '../src/models/user.model.js';

const requester = supertest(app);

describe('Suite de Tests Funcionales - Carga de Archivos (Multer)', () => {
    const dummyFilePath = path.join(process.cwd(), 'tests', 'test-file.pdf');
    const largeFilePath = path.join(process.cwd(), 'tests', 'large-file.pdf');
    let testUser;

    before(() => {
        // Crear archivos físicos de prueba una sola vez
        fs.writeFileSync(dummyFilePath, '%PDF-1.4 Fake PDF Content for testing');
        const largeBuffer = Buffer.alloc(6 * 1024 * 1024, 'a');
        fs.writeFileSync(largeFilePath, largeBuffer);
    });

    beforeEach(async () => {
        // Garantizar que el usuario exista justo antes de ejecutar cada test
        testUser = await UserModel.create({
            first_name: 'Test',
            last_name: 'Upload',
            email: `test_upload_${Date.now()}_${Math.random().toString(36).substring(7)}@test.com`,
            password: 'hashedpassword123',
            role: 'USER'
        });
    });

    after(() => {
        if (fs.existsSync(dummyFilePath)) fs.unlinkSync(dummyFilePath);
        if (fs.existsSync(largeFilePath)) fs.unlinkSync(largeFilePath);
    });

    it('POST /api/users/:uid/documents - Debe subir archivo exitosamente (2xx) y persistir metadatos', async () => {
        const response = await requester
            .post(`/api/users/${testUser._id.toString()}/documents`)
            .field('docType', 'DNI')
            .attach('document', dummyFilePath, { contentType: 'application/pdf' });

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('status').that.equals('success');

        // Verificar persistencia en base de datos
        const updatedUser = await UserModel.findById(testUser._id);
        expect(updatedUser.documents).to.be.an('array').that.is.not.empty;
        expect(updatedUser.documents[0]).to.have.property('docType').that.equals('DNI');
        expect(updatedUser.documents[0]).to.have.property('name');
    });

    it('POST /api/users/:uid/documents - Debe fallar (400) si el archivo excede los 5MB', async () => {
        const response = await requester
            .post(`/api/users/${testUser._id.toString()}/documents`)
            .field('docType', 'DNI')
            .attach('document', largeFilePath, { contentType: 'application/pdf' });

        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('status').that.equals('error');
        expect(response.body).to.have.property('error').that.equals('LIMIT_FILE_SIZE');
    });

    it('POST /api/users/:uid/documents - Debe responder 400 si falta el archivo', async () => {
        const response = await requester
            .post(`/api/users/${testUser._id.toString()}/documents`)
            .field('docType', 'DNI');

        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('status').that.equals('error');
    });

    it('POST /api/users/:uid/documents - Debe responder 400 si el docType es inválido', async () => {
        const response = await requester
            .post(`/api/users/${testUser._id.toString()}/documents`)
            .field('docType', 'TIPO_INVALIDO')
            .attach('document', dummyFilePath, { contentType: 'application/pdf' });

        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('status').that.equals('error');
    });

    it('POST /api/users/:uid/documents - Debe responder 404 si el usuario no existe', async () => {
        const fakeUid = new mongoose.Types.ObjectId().toString();

        const response = await requester
            .post(`/api/users/${fakeUid}/documents`)
            .field('docType', 'DNI')
            .attach('document', dummyFilePath, { contentType: 'application/pdf' });

        expect(response.status).to.equal(404);
        expect(response.body).to.have.property('status').that.equals('error');
    });
});