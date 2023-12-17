import { toCamelArr, toCamelCase } from '@/utils'

describe('toCamelCase', () => {
  it('converts snake_case to camelCase', () => {
    expect(toCamelCase('snake_case')).toBe('snakeCase')
    expect(toCamelCase('snake_case_2')).toBe('snakeCase2')
    expect(toCamelCase('snake_case_nN')).toBe('snakeCaseNN')
  })

  it('return an empty string if the input is an empty string', () => {
    expect(toCamelCase('')).toBe('')
  })

  it('return same value if the input is not includes _', () => {
    expect(toCamelCase('id')).toBe('id')
  })
})

describe('toCamelArr', () => {
  it ('chatItemLists', () => {
    const input = [
      {
        id: 29,
        item_name: 'New Chat',
        item_uuid: '0f205b6a-af0c-40a4-9df1-898956038905',
        created_at: '2023-12-16T14:22:12.120Z',
        updated_at: '2023-12-16T14:22:12.120Z',
        isStarred: false,
        user_primary_id: 3
      },
      {
        id: 37,
        item_name: 'New test2',
        item_uuid: 'daf245a4-72e7-44bc-93f9-be07b1dc4993',
        created_at: '2023-12-17T07:51:29.347Z',
        updated_at: '2023-12-17T10:40:56.391Z',
        isStarred: false,
        user_primary_id: 3
      },
      {
        id: 46,
        item_name: 'New Chat',
        item_uuid: 'e0604c2c-9115-4ffd-8f54-60e570491ec8',
        created_at: '2023-12-17T15:42:57.310Z',
        updated_at: '2023-12-17T15:42:57.310Z',
        isStarred: false,
        user_primary_id: 3
      }
    ]

    const output = [
      {
        id: 29,
        itemName: 'New Chat',
        itemUuid: '0f205b6a-af0c-40a4-9df1-898956038905',
        createdAt: '2023-12-16T14:22:12.120Z',
        updatedAt: '2023-12-16T14:22:12.120Z',
        isStarred: false,
        userPrimaryId: 3
      },
      {
        id: 37,
        itemName: 'New test2',
        itemUuid: 'daf245a4-72e7-44bc-93f9-be07b1dc4993',
        createdAt: '2023-12-17T07:51:29.347Z',
        updatedAt: '2023-12-17T10:40:56.391Z',
        isStarred: false,
        userPrimaryId: 3
      },
      {
        id: 46,
        itemName: 'New Chat',
        itemUuid: 'e0604c2c-9115-4ffd-8f54-60e570491ec8',
        createdAt: '2023-12-17T15:42:57.310Z',
        updatedAt: '2023-12-17T15:42:57.310Z',
        isStarred: false,
        userPrimaryId: 3
      }
    ]
    expect(toCamelArr(input)).toEqual(output)
  })
})


