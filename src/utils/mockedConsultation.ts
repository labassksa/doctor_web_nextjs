export const mockConsultations = [
    {
        "createdAt": "2024-05-31T07:41:29.935Z",
        "status": "PendingPayment",
        "id": 1,
        "doctorJoinedAT": null,
        "patientJoinedAT": null,
        "patientPaidAT": null,
        "closedAt": null,
        "type": "quick",
        "doctor": null,
        "patient": {
            "id": 4,
            "user": {
                "createdAt": "2024-05-29T20:29:32.024Z",
                "id": 5,
                "phoneNumber": "+966591717029",
                "firstName": "يزيد",
                "lastName": "Abo Saad",
                "email": null,
                "gender": "male",
                "nationalId": "1111111886",
                "dateOfBirth": "1990-01-01",
                "role": "patient"
            }
        },
        "prescription": null,
        "soap": null,
        "sickLeave": null
    },
    {
        "createdAt": "2024-06-01T12:00:00.000Z",
        "status": "Completed",
        "id": 2,
        "doctorJoinedAT": "2024-06-01T13:00:00.000Z",
        "patientJoinedAT": null,
        "patientPaidAT": "2024-06-01T12:05:00.000Z",
        "closedAt": "2024-06-01T14:00:00.000Z",
        "type": "Detailed",
        "doctor": {
            "id": 6,
            "specialty": "Cardiology",
            "medicalLicenseNumber": "123456",
            "iban": "SA0300000001234567891234",
            "user": {
                "createdAt": "2024-05-25T08:30:00.000Z",
                "id": 6,
                "phoneNumber": "+966500000000",
                "firstName": "Sarah",
                "lastName": "AlAhmed",
                "email": "sarah@example.com",
                "gender": "female",
                "nationalId": "2222222222",
                "dateOfBirth": "1985-07-15",
                "role": "doctor"
            }
        },
        "prescription": true,
        "soap": true,
        "sickLeave": false
    },
    {
        "createdAt": "2024-06-02T10:15:30.000Z",
        "status": "Cancelled",
        "id": 3,
        "doctorJoinedAT": null,
        "patientJoinedAT": null,
        "patientPaidAT": null,
        "closedAt": null,
        "type": "Quick",
        "doctor": null,
        "patient": {
            "id": 7,
            "user": {
                "createdAt": "2024-05-30T09:22:00.000Z",
                "id": 7,
                "phoneNumber": "+966501234567",
                "firstName": "Mohammed",
                "lastName": "AlSulami",
                "email": "mohammed@example.com",
                "gender": "male",
                "nationalId": "3333333333",
                "dateOfBirth": "1980-11-11",
                "role": "patient"
            }
        },
        "prescription": null,
        "soap": null,
        "sickLeave": null
    }
];
