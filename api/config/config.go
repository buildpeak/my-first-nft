package config

import "os"

type DBConfig struct {
	DRV     string
	Host    string
	Port    string
	User    string
	Pass    string
	Name    string
	SSLMode string
}

type Config struct {
	DB DBConfig
}

func New() *Config {
	return &Config{
		DB: DBConfig{
			DRV:     os.Getenv("DB_DRV"),
			Host:    os.Getenv("DB_HOST"),
			Port:    os.Getenv("DB_PORT"),
			User:    os.Getenv("DB_USER"),
			Pass:    os.Getenv("DB_PASS"),
			Name:    os.Getenv("DB_NAME"),
			SSLMode: os.Getenv("DB_SSL_MODE"),
		},
	}
}
