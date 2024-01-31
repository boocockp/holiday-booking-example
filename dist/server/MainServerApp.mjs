import * as serverRuntime from './serverRuntime.cjs'
const {runtimeFunctions} = serverRuntime
const {globalFunctions} = serverRuntime
const {appFunctions} = serverRuntime
const {components} = serverRuntime
const {types} = serverRuntime

const {Check, Record, Pick, Or} = globalFunctions
const {Add, CurrentUser, Get, Update, GetRandomId, CreateUser} = appFunctions
const {FirestoreDataStore, Collection} = components
const {ChoiceType, DateType, ListType, NumberType, DecimalType, RecordType, TextType, TrueFalseType, Rule} = types

const MainDataStore = new FirestoreDataStore({collections: `Bookings
Users
Settings`})
const Bookings = new Collection({dataStore: MainDataStore, collectionName: 'Bookings'})
const Users = new Collection({dataStore: MainDataStore, collectionName: 'Users'})

// MainDataTypes.js
const MainDataTypes = (() => {

    const BookingDates = new RecordType('Booking Dates', {required: false}, [
        new Rule('Dates In Order', $item => $item.FinishDate >= $item.StartDate, {description: 'Finish Date must be on or after Start Date'})
    ], [
        new DateType('Start Date', {required: true}),
        new DateType('Finish Date', {required: true})
    ])
    const UserDetails = new RecordType('User Details', {required: false}, [], [
        new TextType('First Name', {required: true, minLength: 1}),
        new TextType('Last Name', {required: true, minLength: 1}),
        new TextType('Email', {required: true, format: 'email'}),
        new TrueFalseType('Approver', {required: false}),
        new TrueFalseType('Admin', {required: false})
    ])
    const UserNewDetails = new RecordType('User New Details', {basedOn: UserDetails, required: false}, [], [
        new TextType('Password', {required: true})
    ])
    const Team = new RecordType('Team', {required: false}, [], [
        new TextType('Name', {required: true}),
        new TextType('Approver Id', {required: false})
    ])

    return {
        BookingDates,
        UserDetails,
        UserNewDetails,
        Team
    }
})()


const MainServerApp = (user) => {

function CurrentUser() { return runtimeFunctions.asCurrentUser(user) }

async function AddBooking(BookingDetails) {
    Check(BookingDetails.StartDate, 'Start Date must not be empty')
    Check(BookingDetails.FinishDate, 'Finish Date must not be empty')
    //Check(Gte(BookingDetails.FinishDate, BookingDetails.StartDate), "Finish Date must be on or after Start Date")
    await Add(Bookings, Record(BookingDetails, 'UserId', (await CurrentUser()).Id, 'Status','Requested', ))
}

async function UpdateBooking(Id, BookingUpdates) {
    let booking = await Get(Bookings, Id)
    Check(BookingUpdates.StartDate, 'Start Date must not be empty')
    Check(BookingUpdates.FinishDate, 'Finish Date must not be empty')
    //Check(Gte(BookingDetails.FinishDate, BookingDetails.StartDate), "Finish Date must be on or after Start Date")
    await Update(Bookings, Id, Record( Pick(BookingUpdates, 'StartDate', 'FinishDate' ), 'Status','Updated'))
}

async function CancelBooking(Id) {
    //Check(Gte(Bookings.Get(Id).StartDate, Today()), "Booking must not have already started")
    await Update(Bookings, Id, Record('Status','Cancelled'))
}

async function GetOwnBookings() {
    return await Bookings.Query({UserId: (await CurrentUser()).Id})
}

async function GetOwnBooking(BookingId) {
    return await Bookings.Get(BookingId)
}

async function GetBooking(BookingId) {
    Check((await Get(Users, (await CurrentUser()).Id)).Approver, 'User must be an Approver')
    return await Bookings.Get(BookingId)
}

async function GetOwnUser() {
    let user = await CurrentUser() 
    return user ? Get(Users, user.Id) : null
}

async function GetAllBookings() {
    Check((await Get(Users, (await CurrentUser()).Id)).Approver, 'User must be an Approver')
    return await Bookings.Query({})
}

async function GetAllUsers() {
    Check((await Get(Users, (await CurrentUser()).Id)).Admin, 'User must be an Admin')
    return await Users.Query({})
}

async function ApproveBooking(Id) {
    Check((await Get(Users, (await CurrentUser()).Id)).Approver, 'User must be an Approver')
    await Update(Bookings, Id, Record('Status','Approved'))
}

async function GetUser(Id) {
    let thisUser = await Get(Users, (await CurrentUser()).Id)
    Check(Or(thisUser.Approver, thisUser.Admin), 'User must be an Approver or Admin')
    return await Get(Users, Id)
}

async function AddNewUser(UserDetails) {
    Check((await Get(Users, (await CurrentUser()).Id)).Admin, 'User must be an Admin')
    let UserId = await GetRandomId()
    Check(UserDetails.FirstName, 'First Name must not be empty')
    Check(UserDetails.LastName, 'Last Name must not be empty')
    let theUser = Pick(UserDetails, 'FirstName', 'LastName', 'Email', 'Approver', 'Admin')
    await Add(Users, theUser)
    let displayName = UserDetails.FirstName + ' ' + UserDetails.LastName
    await CreateUser(UserId, Record({displayName: displayName , email: UserDetails.Email, password: UserDetails.Password}))
}

async function UpdateExistingUser(UserId, UserDetails) {
    Check((await Get(Users, (await CurrentUser()).Id)).Admin, 'User must be an Admin')
    Check(UserDetails.FirstName, 'First Name must not be empty')
    Check(UserDetails.LastName, 'Last Name must not be empty')
    let theUser = Pick(UserDetails, 'FirstName', 'LastName', 'Email', 'Approver', 'Admin')
    await Update(Users, UserId, theUser)
}

return {
    AddBooking: {func: AddBooking, update: true, argNames: ['BookingDetails']},
    UpdateBooking: {func: UpdateBooking, update: true, argNames: ['Id', 'BookingUpdates']},
    CancelBooking: {func: CancelBooking, update: true, argNames: ['Id']},
    GetOwnBookings: {func: GetOwnBookings, update: false, argNames: []},
    GetOwnBooking: {func: GetOwnBooking, update: false, argNames: ['BookingId']},
    GetBooking: {func: GetBooking, update: false, argNames: ['BookingId']},
    GetOwnUser: {func: GetOwnUser, update: false, argNames: []},
    GetAllBookings: {func: GetAllBookings, update: false, argNames: []},
    GetAllUsers: {func: GetAllUsers, update: false, argNames: []},
    ApproveBooking: {func: ApproveBooking, update: true, argNames: ['Id']},
    GetUser: {func: GetUser, update: false, argNames: ['Id']},
    AddNewUser: {func: AddNewUser, update: true, argNames: ['UserDetails']},
    UpdateExistingUser: {func: UpdateExistingUser, update: true, argNames: ['UserId', 'UserDetails']}
}
}

export default MainServerApp