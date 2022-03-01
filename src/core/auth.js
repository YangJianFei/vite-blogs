/**
 * Author: yang jian fei
 * Email: 1294485765@qq.com
 * Created Date: Monday, February 28th 2022, 5:55:32 pm
 * Modified By: yang jian fei
 * Desc: desc
 * Copyright (c) 2022 瑞为
 */

let data = localStorage.getItem('users') || '[]';

try {
    data = JSON.parse(data);
} catch (e) {
    data = [];
    localStorage.removeItem('users');
}

if (!Array.isArray(data)) {
    data = [];
}

export default {
    addUser(user) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].userName === user.userName || data[i].phone === user.phone) {
                return false;
            }
        }
        data.push(user);
        localStorage.setItem('users', JSON.stringify(data));
        return true;
    },
    login(user) {
        for (let i = 0; i < data.length; i++) {
            if ((data[i].userName === user.userName || data[i].userName === user.phone) && data[i].password === user.password) {
                return true;
            }
        }
        return false;
    }
}
