import jwt            from 'jsonwebtoken';
import config         from '../../../../lib/config.cjs';
import { getDirName } from '../../../../lib/utils/index.mjs';
import Tester         from '../Tester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

function requestBuilder(input, token) {
    let url = '/api/v1/admin/admins/?';

    for (const [ key, value ] of Object.entries(input)) {
        url += `${key}=${value}&`;
    }

    return {
        method  : 'GET',
        url,
        headers : {
            'Authorization' : token
        }
    };
}

tester.setupTestsWithTransactions(`${dirname}/../../../fixtures/use-cases/admin/admins-list/positive`,
    'admin/admins-list/positive',
    async ({ config: { before }, input, expected }) => {
        const adminId = await before(tester.factory);
        const accessToken = jwt.sign({ id: adminId }, config.secret);

        await tester.testUseCasePositive({
            requestBuilder : (...args) => requestBuilder(...args, accessToken),
            input,
            expected
        });
    }
);