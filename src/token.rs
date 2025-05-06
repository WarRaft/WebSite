use rand::Rng;
use rand::distr::Alphanumeric;

pub fn token_gen(len: usize) -> String {
    rand::rng()
        .sample_iter(&Alphanumeric)
        .take(len)
        .map(char::from)
        .collect()
}
