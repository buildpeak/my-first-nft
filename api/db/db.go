package db

import (
	"time"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func Open(drv, connStr string) (*sqlx.DB, error) {
	db, err := sqlx.Open(drv, connStr)
	if err != nil {
		return nil, err
	}

	db.SetConnMaxIdleTime(time.Minute * 5)
	db.SetMaxOpenConns(15)
	db.SetMaxIdleConns(15)

	err = db.Ping()

	return db, err
}
