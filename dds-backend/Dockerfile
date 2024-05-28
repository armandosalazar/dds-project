FROM golang:alpine

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY *.go ./

RUN go install github.com/cosmtrek/air@latest

CMD ["air", "-c", ".air.toml"]

