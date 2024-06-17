FROM golang:alpine

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY *.go ./

RUN go install github.com/air-verse/air@latest

CMD ["air", "-c", ".air.toml"]

