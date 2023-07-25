const hi_length_ranges = [15, 30, 20, 17, 9, 9];
const min_hi_length = 2;

const random_length = () => {
    let rand = Math.random() * 100;
    let i = 0;
    for (let n = 0; ; i++) {
        n += hi_length_ranges[i];
        if (rand < n) {
            break;
        }
    }
    return i + min_hi_length;
};

const make_hi = length => {
    return 'h' + 'i'.repeat(length - 1);
};

const random_his = target_length => {
    let sum_length = 0;
    let lengths = [];
    while (true) {
        let next_length = random_length();
        if (sum_length + next_length > target_length) {
            break;
        }
        lengths.push(next_length);
        sum_length += next_length + 1;
    }
    sum_length -= 1;
    let n_lengths = lengths.length;
    while (sum_length < target_length) {
        let length_index = Math.floor(Math.random() * n_lengths);
        lengths[length_index] = lengths[length_index] + 1;
        sum_length += 1;
    }
    return lengths.reduce((acc, v) => (acc += make_hi(v) + ' '), '');
};

const full_length = 70;

/**
 * @returns {Promise<Response>}
 */
const static_fetch = (env, url) => {
    return env.ASSETS.fetch(url);
};

export const onRequestGet = async ctx => {
    const response = await static_fetch(ctx.env, 'https://dummy.tld/');
    let text = await response.text();
    text = text.replace(/--FULL_LENGTH--/g, () => random_his(full_length));
    text = text.replace(/--LEFT_OF_(\d+)--/g, (_, left_of_len) => {
        left_of_len = parseInt(left_of_len);
        return random_his(Math.floor((full_length - left_of_len) / 2) - 1);
    });
    text = text.replace(/--RIGHT_OF_(\d+)--/g, (_, right_of_len) => {
        right_of_len = parseInt(right_of_len);
        return random_his(Math.ceil((full_length - right_of_len) / 2) - 1);
    });
    return new Response(text, { headers: { 'content-type': 'text/html' } });
};
