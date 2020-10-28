import _get from 'lodash/get';
import _set from 'lodash/set';
import _cloneDeep from 'lodash/cloneDeep';
export class FieldSerializer {
  constructor(field) {
    this.field = field;
  }

  deserialize(record, defaultValue = null) {
    let fieldValue = _get(record, this.field, defaultValue);
    return _set(_cloneDeep(record), this.field, fieldValue);
  }

  serialize(record, defaultValue = null) {
    let fieldValue = _get(record, this.field, defaultValue);
    return _set(_cloneDeep(record), this.field, fieldValue);
  }
}
