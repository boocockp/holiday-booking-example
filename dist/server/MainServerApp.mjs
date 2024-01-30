import * as serverRuntime from './serverRuntime.cjs'
const {runtimeFunctions} = serverRuntime
const {globalFunctions} = serverRuntime
const {appFunctions} = serverRuntime
const {components} = serverRuntime

const {Check, Record, Pick} = globalFunctions
const {Add, CurrentUser, Get, Update} = appFunctions
const {FirestoreDataStore, Collection} = components

const MainDataStore = new FirestoreDataStore({collections: `Bookings
Users
Settings`})
const Bookings = new Collection({dataStore: MainDataStore, collectionName: 'Bookings'})
const Users = new Collection({dataStore: MainDataStore, collectionName: 'Users'})

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

async function ApproveBooking(Id) {
    Check((await Get(Users, (await CurrentUser()).Id)).Approver, 'User must be an Approver')
    await Update(Bookings, Id, Record('Status','Approved'))
}

async function GetUser(Id) {
    Check((await Get(Users, (await CurrentUser()).Id)).Approver, 'User must be an Approver')
    return await Get(Users, Id)
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
    ApproveBooking: {func: ApproveBooking, update: true, argNames: ['Id']},
    GetUser: {func: GetUser, update: false, argNames: ['Id']}
}
}

export default MainServerApp