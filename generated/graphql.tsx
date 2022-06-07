import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AddItemToCartInput = {
  cartId: Scalars['ID'];
  itemId: Scalars['ID'];
  quantity: Scalars['Int'];
};

export type Cart = {
  __typename?: 'Cart';
  cartItems?: Maybe<Array<Maybe<CartItem>>>;
  id: Scalars['ID'];
  subtotal?: Maybe<Scalars['Float']>;
};

export type CartItem = {
  __typename?: 'CartItem';
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  item_id: Scalars['Int'];
  nacs_category?: Maybe<Scalars['String']>;
  nacs_subcategory?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  price: Scalars['Float'];
  quantity: Scalars['Int'];
  unit_size: Scalars['Int'];
  upc1?: Maybe<Scalars['ID']>;
  upc2?: Maybe<Scalars['ID']>;
};

export type Category = {
  __typename?: 'Category';
  image?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type CategoryInput = {
  value?: InputMaybe<Scalars['String']>;
};

export type CreateCartInput = {
  userId: Scalars['ID'];
};

export type CreateTable = {
  cartID: Scalars['ID'];
  itemID: Scalars['ID'];
  quantity: Scalars['Int'];
};

export type GetCartsInput = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  userId: Scalars['ID'];
};

export type GetCategoriesInput = {
  pagination?: InputMaybe<PaginationInput>;
};

export type GetItemsByCategoryInput = {
  category?: InputMaybe<CategoryInput>;
  pagination?: InputMaybe<PaginationInput>;
};

export type GetItemsInput = {
  pagination?: InputMaybe<PaginationInput>;
  upcs?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type GetOrdersInput = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  userId: Scalars['ID'];
};

export type GetUsersInput = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type Item = {
  __typename?: 'Item';
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  nacs_category?: Maybe<Scalars['String']>;
  nacs_subcategory?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  price: Scalars['Float'];
  unit_size?: Maybe<Scalars['Int']>;
  upc1?: Maybe<Scalars['ID']>;
  upc2?: Maybe<Scalars['ID']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createCart?: Maybe<Cart>;
  submitOrder?: Maybe<Order>;
  updateItemInCart?: Maybe<Cart>;
};


export type MutationCreateCartArgs = {
  cart: CreateCartInput;
};


export type MutationSubmitOrderArgs = {
  submitOrderInput: SubmitOrderInput;
};


export type MutationUpdateItemInCartArgs = {
  updateItemInCartInput: UpdateItemInCartInput;
};

export type Order = {
  __typename?: 'Order';
  date_submitted?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  orderItems?: Maybe<Array<Maybe<CartItem>>>;
  status: Scalars['String'];
  subtotal: Scalars['Float'];
};

export type PaginationInput = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  carts: Array<Maybe<Cart>>;
  categories: Array<Maybe<Category>>;
  items: Array<Maybe<Item>>;
  itemsByCategory: Array<Maybe<Item>>;
  orders: Array<Maybe<Order>>;
  users: Array<Maybe<User>>;
};


export type QueryCartsArgs = {
  getCartsInput: GetCartsInput;
};


export type QueryCategoriesArgs = {
  getCategoriesInput?: InputMaybe<GetCategoriesInput>;
};


export type QueryItemsArgs = {
  getItemsInput?: InputMaybe<GetItemsInput>;
};


export type QueryItemsByCategoryArgs = {
  getItemsByCategoryInput?: InputMaybe<GetItemsByCategoryInput>;
};


export type QueryOrdersArgs = {
  getOrdersInput?: InputMaybe<GetOrdersInput>;
};


export type QueryUsersArgs = {
  getUsersInput?: InputMaybe<GetUsersInput>;
};

export type SubmitOrderInput = {
  cartId: Scalars['ID'];
  userId: Scalars['ID'];
};

export type UpdateItemInCartInput = {
  cartId: Scalars['ID'];
  itemId: Scalars['ID'];
  quantity: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
};

export type GetCartsQueryVariables = Exact<{
  getCartsInput: GetCartsInput;
}>;


export type GetCartsQuery = { __typename?: 'Query', carts: Array<{ __typename?: 'Cart', id: string, subtotal?: number | null, cartItems?: Array<{ __typename?: 'CartItem', id: string, name: string, unit_size: number, price: number, upc1?: string | null, upc2?: string | null, nacs_category?: string | null, nacs_subcategory?: string | null, quantity: number, item_id: number } | null> | null } | null> };

export type GetItemsQueryVariables = Exact<{
  getItemsInput?: InputMaybe<GetItemsInput>;
}>;


export type GetItemsQuery = { __typename?: 'Query', items: Array<{ __typename?: 'Item', id: string, name: string, unit_size?: number | null, price: number, upc1?: string | null, upc2?: string | null, nacs_category?: string | null, nacs_subcategory?: string | null, image?: string | null } | null> };

export type GetItemsByCategoryQueryVariables = Exact<{
  getItemsByCategoryInput?: InputMaybe<GetItemsByCategoryInput>;
}>;


export type GetItemsByCategoryQuery = { __typename?: 'Query', itemsByCategory: Array<{ __typename?: 'Item', id: string, name: string, unit_size?: number | null, price: number, upc1?: string | null, upc2?: string | null, nacs_category?: string | null, nacs_subcategory?: string | null, image?: string | null } | null> };

export type GetOrdersQueryVariables = Exact<{
  getOrdersInput?: InputMaybe<GetOrdersInput>;
}>;


export type GetOrdersQuery = { __typename?: 'Query', orders: Array<{ __typename?: 'Order', id: string, status: string, subtotal: number, date_submitted?: number | null, orderItems?: Array<{ __typename?: 'CartItem', id: string, name: string, unit_size: number, price: number, upc1?: string | null, upc2?: string | null, nacs_category?: string | null, nacs_subcategory?: string | null, quantity: number, item_id: number, image?: string | null } | null> | null } | null> };

export type GetUsersQueryVariables = Exact<{
  getUsersInput?: InputMaybe<GetUsersInput>;
}>;


export type GetUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, name?: string | null } | null> };

export type SubmitOrderMutationVariables = Exact<{
  submitOrderInput: SubmitOrderInput;
}>;


export type SubmitOrderMutation = { __typename?: 'Mutation', submitOrder?: { __typename?: 'Order', id: string, status: string, subtotal: number } | null };

export type UpdateItemInCartMutationVariables = Exact<{
  updateItemInCartInput: UpdateItemInCartInput;
}>;


export type UpdateItemInCartMutation = { __typename?: 'Mutation', updateItemInCart?: { __typename?: 'Cart', id: string, subtotal?: number | null, cartItems?: Array<{ __typename?: 'CartItem', id: string, name: string, unit_size: number, price: number, upc1?: string | null, upc2?: string | null, nacs_category?: string | null, nacs_subcategory?: string | null, quantity: number, item_id: number } | null> | null } | null };

export type GetCategoriesQueryVariables = Exact<{
  getCategoriesInput?: InputMaybe<GetCategoriesInput>;
}>;


export type GetCategoriesQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', name?: string | null, value?: string | null, image?: string | null } | null> };


export const GetCartsDocument = gql`
    query GetCarts($getCartsInput: GetCartsInput!) {
  carts(getCartsInput: $getCartsInput) {
    id
    cartItems {
      id
      name
      unit_size
      price
      upc1
      upc2
      nacs_category
      nacs_subcategory
      quantity
      item_id
    }
    subtotal
  }
}
    `;

/**
 * __useGetCartsQuery__
 *
 * To run a query within a React component, call `useGetCartsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCartsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCartsQuery({
 *   variables: {
 *      getCartsInput: // value for 'getCartsInput'
 *   },
 * });
 */
export function useGetCartsQuery(baseOptions: Apollo.QueryHookOptions<GetCartsQuery, GetCartsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCartsQuery, GetCartsQueryVariables>(GetCartsDocument, options);
      }
export function useGetCartsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCartsQuery, GetCartsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCartsQuery, GetCartsQueryVariables>(GetCartsDocument, options);
        }
export type GetCartsQueryHookResult = ReturnType<typeof useGetCartsQuery>;
export type GetCartsLazyQueryHookResult = ReturnType<typeof useGetCartsLazyQuery>;
export type GetCartsQueryResult = Apollo.QueryResult<GetCartsQuery, GetCartsQueryVariables>;
export const GetItemsDocument = gql`
    query GetItems($getItemsInput: GetItemsInput) {
  items(getItemsInput: $getItemsInput) {
    id
    name
    unit_size
    price
    upc1
    upc2
    nacs_category
    nacs_subcategory
    image
  }
}
    `;

/**
 * __useGetItemsQuery__
 *
 * To run a query within a React component, call `useGetItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetItemsQuery({
 *   variables: {
 *      getItemsInput: // value for 'getItemsInput'
 *   },
 * });
 */
export function useGetItemsQuery(baseOptions?: Apollo.QueryHookOptions<GetItemsQuery, GetItemsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetItemsQuery, GetItemsQueryVariables>(GetItemsDocument, options);
      }
export function useGetItemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetItemsQuery, GetItemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetItemsQuery, GetItemsQueryVariables>(GetItemsDocument, options);
        }
export type GetItemsQueryHookResult = ReturnType<typeof useGetItemsQuery>;
export type GetItemsLazyQueryHookResult = ReturnType<typeof useGetItemsLazyQuery>;
export type GetItemsQueryResult = Apollo.QueryResult<GetItemsQuery, GetItemsQueryVariables>;
export const GetItemsByCategoryDocument = gql`
    query GetItemsByCategory($getItemsByCategoryInput: GetItemsByCategoryInput) {
  itemsByCategory(getItemsByCategoryInput: $getItemsByCategoryInput) {
    id
    name
    unit_size
    price
    upc1
    upc2
    nacs_category
    nacs_subcategory
    image
  }
}
    `;

/**
 * __useGetItemsByCategoryQuery__
 *
 * To run a query within a React component, call `useGetItemsByCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetItemsByCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetItemsByCategoryQuery({
 *   variables: {
 *      getItemsByCategoryInput: // value for 'getItemsByCategoryInput'
 *   },
 * });
 */
export function useGetItemsByCategoryQuery(baseOptions?: Apollo.QueryHookOptions<GetItemsByCategoryQuery, GetItemsByCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetItemsByCategoryQuery, GetItemsByCategoryQueryVariables>(GetItemsByCategoryDocument, options);
      }
export function useGetItemsByCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetItemsByCategoryQuery, GetItemsByCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetItemsByCategoryQuery, GetItemsByCategoryQueryVariables>(GetItemsByCategoryDocument, options);
        }
export type GetItemsByCategoryQueryHookResult = ReturnType<typeof useGetItemsByCategoryQuery>;
export type GetItemsByCategoryLazyQueryHookResult = ReturnType<typeof useGetItemsByCategoryLazyQuery>;
export type GetItemsByCategoryQueryResult = Apollo.QueryResult<GetItemsByCategoryQuery, GetItemsByCategoryQueryVariables>;
export const GetOrdersDocument = gql`
    query GetOrders($getOrdersInput: GetOrdersInput) {
  orders(getOrdersInput: $getOrdersInput) {
    id
    status
    subtotal
    date_submitted
    orderItems {
      id
      name
      unit_size
      price
      upc1
      upc2
      nacs_category
      nacs_subcategory
      quantity
      item_id
      image
    }
  }
}
    `;

/**
 * __useGetOrdersQuery__
 *
 * To run a query within a React component, call `useGetOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrdersQuery({
 *   variables: {
 *      getOrdersInput: // value for 'getOrdersInput'
 *   },
 * });
 */
export function useGetOrdersQuery(baseOptions?: Apollo.QueryHookOptions<GetOrdersQuery, GetOrdersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrdersQuery, GetOrdersQueryVariables>(GetOrdersDocument, options);
      }
export function useGetOrdersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrdersQuery, GetOrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrdersQuery, GetOrdersQueryVariables>(GetOrdersDocument, options);
        }
export type GetOrdersQueryHookResult = ReturnType<typeof useGetOrdersQuery>;
export type GetOrdersLazyQueryHookResult = ReturnType<typeof useGetOrdersLazyQuery>;
export type GetOrdersQueryResult = Apollo.QueryResult<GetOrdersQuery, GetOrdersQueryVariables>;
export const GetUsersDocument = gql`
    query GetUsers($getUsersInput: GetUsersInput) {
  users(getUsersInput: $getUsersInput) {
    id
    name
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *      getUsersInput: // value for 'getUsersInput'
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;
export const SubmitOrderDocument = gql`
    mutation SubmitOrder($submitOrderInput: SubmitOrderInput!) {
  submitOrder(submitOrderInput: $submitOrderInput) {
    id
    status
    subtotal
  }
}
    `;
export type SubmitOrderMutationFn = Apollo.MutationFunction<SubmitOrderMutation, SubmitOrderMutationVariables>;

/**
 * __useSubmitOrderMutation__
 *
 * To run a mutation, you first call `useSubmitOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitOrderMutation, { data, loading, error }] = useSubmitOrderMutation({
 *   variables: {
 *      submitOrderInput: // value for 'submitOrderInput'
 *   },
 * });
 */
export function useSubmitOrderMutation(baseOptions?: Apollo.MutationHookOptions<SubmitOrderMutation, SubmitOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitOrderMutation, SubmitOrderMutationVariables>(SubmitOrderDocument, options);
      }
export type SubmitOrderMutationHookResult = ReturnType<typeof useSubmitOrderMutation>;
export type SubmitOrderMutationResult = Apollo.MutationResult<SubmitOrderMutation>;
export type SubmitOrderMutationOptions = Apollo.BaseMutationOptions<SubmitOrderMutation, SubmitOrderMutationVariables>;
export const UpdateItemInCartDocument = gql`
    mutation UpdateItemInCart($updateItemInCartInput: UpdateItemInCartInput!) {
  updateItemInCart(updateItemInCartInput: $updateItemInCartInput) {
    id
    cartItems {
      id
      name
      unit_size
      price
      upc1
      upc2
      nacs_category
      nacs_subcategory
      quantity
      item_id
    }
    subtotal
  }
}
    `;
export type UpdateItemInCartMutationFn = Apollo.MutationFunction<UpdateItemInCartMutation, UpdateItemInCartMutationVariables>;

/**
 * __useUpdateItemInCartMutation__
 *
 * To run a mutation, you first call `useUpdateItemInCartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateItemInCartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateItemInCartMutation, { data, loading, error }] = useUpdateItemInCartMutation({
 *   variables: {
 *      updateItemInCartInput: // value for 'updateItemInCartInput'
 *   },
 * });
 */
export function useUpdateItemInCartMutation(baseOptions?: Apollo.MutationHookOptions<UpdateItemInCartMutation, UpdateItemInCartMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateItemInCartMutation, UpdateItemInCartMutationVariables>(UpdateItemInCartDocument, options);
      }
export type UpdateItemInCartMutationHookResult = ReturnType<typeof useUpdateItemInCartMutation>;
export type UpdateItemInCartMutationResult = Apollo.MutationResult<UpdateItemInCartMutation>;
export type UpdateItemInCartMutationOptions = Apollo.BaseMutationOptions<UpdateItemInCartMutation, UpdateItemInCartMutationVariables>;
export const GetCategoriesDocument = gql`
    query GetCategories($getCategoriesInput: GetCategoriesInput) {
  categories(getCategoriesInput: $getCategoriesInput) {
    name
    value
    image
  }
}
    `;

/**
 * __useGetCategoriesQuery__
 *
 * To run a query within a React component, call `useGetCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoriesQuery({
 *   variables: {
 *      getCategoriesInput: // value for 'getCategoriesInput'
 *   },
 * });
 */
export function useGetCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, options);
      }
export function useGetCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, options);
        }
export type GetCategoriesQueryHookResult = ReturnType<typeof useGetCategoriesQuery>;
export type GetCategoriesLazyQueryHookResult = ReturnType<typeof useGetCategoriesLazyQuery>;
export type GetCategoriesQueryResult = Apollo.QueryResult<GetCategoriesQuery, GetCategoriesQueryVariables>;