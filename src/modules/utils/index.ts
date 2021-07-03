export type ResultOrError<T> = [T, Error]

export class Result<T> {
	isSuccess: boolean

	isFailure: boolean

	error?: string

	private _value?: T

	private constructor(isSuccess: boolean, error?: string, value?: T) {
		if (isSuccess && error) {
			throw new Error(
				'InvalidOperation: a successful result cannot contain an error',
			)
		}

		if (!isSuccess && !error) {
			throw new Error(
				'InvalidOperation: an unsuccessful result should contain an error',
			)
		}

		this.isSuccess = isSuccess
		this.isFailure = !isSuccess
		this.error = error
		this._value = value

		Object.freeze(this)
	}

	static ok<U>(value: U): Result<U> {
		return new Result<U>(true, undefined, value)
	}

	static fail<U>(error: string): Result<U> {
		return new Result<U>(false, error)
	}

	get value(): T {
		if (!this.isSuccess) {
			throw new Error('Cannot retrieve value from unsuccessful result')
		}

		return this._value as T
	}
}
