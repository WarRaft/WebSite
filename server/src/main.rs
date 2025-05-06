mod render;
mod token;

use hyper::{Request, Response, StatusCode, server::conn::http1, service::service_fn};
use hyper_util::rt::TokioIo;
use std::net::SocketAddr;
use tokio::net::TcpListener;

use crate::render::render;

async fn request_callback(
    _req: Request<hyper::body::Incoming>,
) -> Result<Response<String>, hyper::http::Error> {
    println!("Request received");

    Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "text/html; charset=utf-8")
        .body(render().into_string())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let addr: SocketAddr = ([127, 0, 0, 1], 3000).into();

    let listener = TcpListener::bind(addr).await?;

    loop {
        let (stream, _) = listener.accept().await?;
        let io = TokioIo::new(stream);

        tokio::task::spawn(async move {
            if let Err(err) = http1::Builder::new()
                .serve_connection(io, service_fn(request_callback))
                .await
            {
                eprintln!("Error serving connection: {}", err);
            }
        });
    }
}
