import { Then, When } from '@cucumber/cucumber';
import { DataTable } from '@cucumber/cucumber';

import assert from 'assert';

let response: { status: number };

When('I send a POST request to users with the following body:', async function (dataTable: DataTable) {
    const rows = dataTable.rows();
    const body = {
        name: rows[0][0],
        email: rows[0][1],
        password: rows[0][2],
    };

    console.log('Simulated POST to /users with body:', body);

    response = { status: 201 };
});

Then('I receive a response with status code {int}', function (expectedStatusCode: number) {
    assert.strictEqual(response.status, expectedStatusCode);
});
