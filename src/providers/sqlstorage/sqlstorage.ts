import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class Sqlstorage {
  private db: SQLiteObject;

  constructor(private sqlite: SQLite) { }

  getAll() {
    return this.db.executeSql('SELECT key, value FROM kv', []).then(data => {
      let results = [];
      for (let i = 0; i < data.length; i++) {
        results.push(JSON.parse(data.rows.item(i).value));
      }
      return results;
    });
  }

  get(key: string) {
    return this.db.executeSql('SELECT key, value FROM kv WHERE key = ? limit 1', [key]).then(data => {
      if (data.rows.length > 0) {
        return JSON.parse(data.rows.item(0).value);
      }
    });
  }

  remove(key: string) {
    return this.db.executeSql('delete from kv where kv = ?', key);
  }

  set(key: string, value: string) {
    return this.db.executeSql('insert or replace into kv(key, value) values (?,?)', [key, value]).then(data => {
      if (data.rows.length > 0) {
        return JSON.parse(data.rows.item(0).value);
      }
    });
  }

  initializeDatabase() {
    return this.sqlite.create({ name: "data.db", location: 'default' }).then(db => {
      this.db = db;
      return this.db.executeSql('CREATE TABLE IF NOT EXISTS kv (key text primary key, value text)', [])
        .then(data => {
        });
    });
  }

}
