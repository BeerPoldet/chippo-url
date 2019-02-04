const success = 'success'
const failure = 'failure'

class Result {
  constructor(type, payload) {
    this.type = type
    this.payload = payload
  }

  static failure(error) {
    return new Result(failure, error)
  }
  static success(value) {
    return new Result(success, value)
  }

  isFailure() {
    return this.type === failure
  }
  isSuccess() {
    return this.type === success
  }

  match(successCase, failureCase) {
    if (this.isSuccess()) return successCase(this.payload)
    else return failureCase(this.payload)
  }

  mapSuccess(transform) {
    return this.match(
      value => {
        return Result.success(transform(value))
      },
      error => {
        return this
      },
    )
  }

  flatMapSuccess(transform) {
    return this.match(
      value => {
        return transform(value)
      },
      error => {
        return this
      },
    )
  }

  mapFailure(transform) {
    return this.match(
      value => {
        return this
      },
      error => {
        return Result.failure(transform(error))
      },
    )
  }

  flatMapFailure(transform) {
    return this.match(
      value => {
        return this
      },
      error => {
        return transform(error)
      },
    )
  }
}

exports.Result = Result