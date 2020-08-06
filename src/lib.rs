use wasm_bindgen::prelude::*;
extern crate image;
use base64::encode;
use std::io::{Cursor, Read, Seek, SeekFrom};
use std::vec::Vec;

fn load_image_from_array(arr: &[u8]) -> image::DynamicImage {
    let img = match image::load_from_memory_with_format(arr, image::ImageFormat::Png) {
        Ok(img) => img,
        Err(err) => {
            panic!("format error, {:?}", err);
        }
    };
    img
}

fn get_base64_image(img: image::DynamicImage) -> String {
    let mut c = Cursor::new(Vec::new());
    match img.write_to(&mut c, image::ImageFormat::Png) {
        Ok(c) => c,
        Err(error) => panic!(
            "There was a problem writing the resulting buffer: {:?}",
            error
        ),
    };
    c.seek(SeekFrom::Start(0)).unwrap();
    let mut out = Vec::new();
    c.read_to_end(&mut out).unwrap();
    let stt = encode(&mut out);
    let together = format!("{}{}", "data:image/png;base64,", stt);
    return together;
}

#[wasm_bindgen]
pub fn get_image_gray(data: &[u8]) -> String {
    let mut image = load_image_from_array(data);
    image = image.blur(2.0);
    let base64_str = get_base64_image(image);
    return base64_str;
}

#[wasm_bindgen]
pub fn say(s: &str) -> String {
    let r = String::from("hello ");
    println!("{}", s);
    return r;
}
