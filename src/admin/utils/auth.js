import { staffAccounts } from "../data/staffAccounts"


export function loginRequest({email, password}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
        const account = staffAccounts.find(
            (acc) =>
            acc.email.toLowerCase() === email.toLowerCase() &&
            acc.password === password
        );
        if (account) {
            const { password: _pw, ...safeAccount } = account;
            resolve(safeAccount);
        } else {
            reject(new Error('Invalid email or password'));
        }
    }, 500);
  })
}
