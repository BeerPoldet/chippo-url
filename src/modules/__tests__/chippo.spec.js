const { Result } = require('../result')
const {
  isExistCreator,
  findByAliasCreator,
  parseChippoRequest,
  toURL,
  upsertURLCreator,
} = require('../chippo')

describe('findByAlias()', () => {
  it('should return failure if no chippo returns', async () => {
    const findByAlias = findByAliasCreator(async () => undefined)
    expect((await findByAlias('abc')).isFailure()).toBeTruthy()
  })

  it('should return success if chippo returns', async () => {
    const findByAlias = findByAliasCreator(async () => ({
      alias: 'abc',
      url: 'abc.com',
    }))
    const result = await findByAlias('abc')
    expect(result.isSuccess()).toBeTruthy()
    expect(result.payload).toEqual({
      alias: 'abc',
      url: 'abc.com',
    })
  })
})

describe('isExist()', () => {
  it('should return failure if one of alias or url is not supplied', async () => {
    const isExist = isExistCreator(async () => {})
    expect((await isExist('abc', undefined)).isFailure()).toBeTruthy()
    expect((await isExist(undefined, 'abc')).isFailure()).toBeTruthy()
    expect((await isExist(undefined, undefined)).isFailure()).toBeTruthy()
  })

  it('should return failure if no chippo matches', async () => {
    const isExist = isExistCreator(async () => undefined)
    const result = await isExist('abc', 'abc.com')
    expect(result.isFailure()).toBeTruthy()
    expect(result.payload).toEqual({ alias: 'abc', url: 'abc.com' })
  })

  it('should return success if found chippo matches', async () => {
    const isExist = isExistCreator(async () => ({ alias: 'abc', url: 'abc.com' }))
    const result = await isExist('abc', 'abc.com')
    expect(result.isSuccess()).toBeTruthy()
    expect(result.payload).toEqual({ alias: 'abc', url: 'abc.com' })
  })
})

describe('parseChippoRequest()', () => {
  it('should return chippo containing url', () => {
    expect(parseChippoRequest({ url: 'a.com' }).payload).toEqual({
      alias: undefined,
      url: 'a.com',
    })
    expect(parseChippoRequest({ alias: 'hi', url: 'a.com' }).payload).toEqual({
      alias: 'hi',
      url: 'a.com',
    })
  })

  it('should return undefined for empty request', () => {
    expect(parseChippoRequest(undefined).isFailure()).toBeTruthy()
    expect(parseChippoRequest(null).isFailure()).toBeTruthy()
    expect(parseChippoRequest({}).isFailure()).toBeTruthy()
  })

  it('should return undefined on invalid request', () => {
    expect(parseChippoRequest({ url: '' }).isFailure()).toBeTruthy()
    expect(
      parseChippoRequest({ alias: 'hi', url: undefined }).isFailure(),
    ).toBeTruthy()
  })
})

describe('toURL()', () => {
  it('should add http if it needs to', () => {
    expect(toURL('abc.com')).toEqual('http://abc.com')
    expect(toURL('def.com')).toEqual('http://def.com')
  })

  it('should not add if it is already a URL', () => {
    expect(toURL('http://abc.com')).toEqual('http://abc.com')
    expect(toURL('https://def.com')).toEqual('https://def.com')
  })
})

describe('upsertURLCreator()', () => {
  it('should return failure on invalid request', async () => {
    expect((await upsertURLCreator({})(undefined)).isFailure()).toBeTruthy()
    expect((await upsertURLCreator({})({})).isFailure()).toBeTruthy()
  })

  describe('supply exist customAlias', () => {
    it('should return failure on url does not matched', async () => {
      const upsertURL = upsertURLCreator({
        findChippoURLByAlias: async () => ({
          alias: 'abc',
          url: 'http://a.com',
        }),
      })
      const result = await upsertURL({
        alias: 'abc',
        url: 'z.com',
      })
      expect(result.isFailure()).toBeTruthy()
      expect(result.payload).toEqual({
        request: { alias: 'abc', url: 'http://z.com' },
      })
    })

    it('should return success on url matched', async () => {
      const upsertURL = upsertURLCreator({
        findChippoURLByAlias: async () => ({
          alias: 'abc',
          url: 'http://a.com',
        }),
      })
      const result = await upsertURL({
        alias: 'abc',
        url: 'a.com',
      })
      expect(result.payload).toEqual({
        chippo: { alias: 'abc', url: 'http://a.com' },
        request: { alias: 'abc', url: 'http://a.com' },
      })
      expect(result.isSuccess()).toBeTruthy()
    })
  })

  describe('random alias', () => {
    it('should return success where found exist url with exist alias', async () => {
      const upsertURL = upsertURLCreator({
        findChippoURLByURL: async () => ({
          alias: 'abc',
          url: 'http://a.com',
        }),
      })
      const result = await upsertURL({
        url: 'a.com',
      })
      expect(result.payload).toEqual({
        chippo: { alias: 'abc', url: 'http://a.com' },
        request: { alias: undefined, url: 'http://a.com' },
      })
      expect(result.isSuccess()).toBeTruthy()
    })

    it('should return success where found url', async () => {
      const upsertURL = upsertURLCreator({
        findChippoURLByURL: async () => ({
          alias: 'abc',
          url: 'http://a.com',
        }),
      })
      const result = await upsertURL({
        url: 'a.com',
      })
      expect(result.payload).toEqual({
        chippo: { alias: 'abc', url: 'http://a.com' },
        request: { alias: undefined, url: 'http://a.com' },
      })
      expect(result.isSuccess()).toBeTruthy()
    })

    it('should return success with random alias when url is not exist', async () => {
      const upsertURL = upsertURLCreator({
        findChippoURLByURL: async () => null,
        createAlias: () => 'xxx',
        insertURL: async () => true,
      })
      const result = await upsertURL({
        url: 'a.com',
      })
      expect(result.payload).toEqual({
        chippo: { alias: 'xxx', url: 'http://a.com' },
        request: { alias: undefined, url: 'http://a.com' },
      })
      expect(result.isSuccess()).toBeTruthy()
    })

    it(`should return failure when url is not exist but database error. 
      eg. same alias is being inserted in the same time and one of them will get failure`, async () => {
      const upsertURL = upsertURLCreator({
        findChippoURLByURL: async () => null,
        createAlias: () => 'xxx',
        insertURL: async () => false,
      })
      const result = await upsertURL({
        url: 'a.com',
      })
      expect(result.payload).toEqual({
        request: { alias: undefined, url: 'http://a.com' },
      })
      expect(result.isFailure()).toBeTruthy()
    })
  })
})
