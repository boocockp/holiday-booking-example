const runtimeUrl = window.elementoRuntimeUrl || 'https://elemento.online/lib/runtime.js'
const Elemento = await import(runtimeUrl)
const {React} = Elemento

// MyBookingsPage.js
function MyBookingsPage_BookingsListItem(props) {
    const pathWith = name => props.path + '.' + name
    const parentPathWith = name => Elemento.parentPath(props.path) + '.' + name
    const {$item} = props
    const {Layout, Calculation, TextElement, Button} = Elemento.components
    const {DateFormat} = Elemento.globalFunctions
    const app = Elemento.useGetObjectState('app')
    const {ShowPage} = app
    const StartDate = Elemento.useObjectState(pathWith('StartDate'), new Calculation.State({value: DateFormat($item.StartDate, 'dd MMM yyyy')}))
    const FinishDate = Elemento.useObjectState(pathWith('FinishDate'), new Calculation.State({value: DateFormat($item.FinishDate, 'dd MMM yyyy')}))
    const UpdateButton_action = React.useCallback(async () => {
        await ShowPage(UpdateBookingPage, $item.id)
    }, [])
    const CancelButton_action = React.useCallback(async () => {
        await ShowPage(CancelBookingPage, $item.id)
    }, [])

    return React.createElement(React.Fragment, null,
        React.createElement(Layout, {path: pathWith('BookingLayout'), horizontal: true, wrap: true},
            React.createElement(Calculation, {path: pathWith('StartDate'), label: 'Start Date', display: true, width: '8em'}),
            React.createElement(Calculation, {path: pathWith('FinishDate'), label: 'Finish Date', display: true, width: '8em'}),
            React.createElement(TextElement, {path: pathWith('Status'), width: '10em'}, $item.Status),
            React.createElement(Button, {path: pathWith('UpdateButton'), content: 'Update', appearance: 'outline', action: UpdateButton_action}),
            React.createElement(Button, {path: pathWith('CancelButton'), content: 'Cancel', appearance: 'outline', action: CancelButton_action}),
    ),
    )
}


function MyBookingsPage(props) {
    const pathWith = name => props.path + '.' + name
    const {Page, TextElement, Button, ListElement} = Elemento.components
    const {Sort} = Elemento.globalFunctions
    const app = Elemento.useGetObjectState('app')
    const {ShowPage} = app
    const MainServerApp = Elemento.useGetObjectState('app.MainServerApp')
    const BookingsList = Elemento.useObjectState(pathWith('BookingsList'), new ListElement.State({}))
    const NewBookingButton_action = React.useCallback(async () => {
        await ShowPage(AddBookingPage)
    }, [])

    return React.createElement(Page, {id: props.path},
        React.createElement(TextElement, {path: pathWith('Title'), fontSize: 22}, 'My Bookings'),
        React.createElement(Button, {path: pathWith('NewBookingButton'), content: 'New Booking', appearance: 'outline', action: NewBookingButton_action}),
        React.createElement(ListElement, {path: pathWith('BookingsList'), itemContentComponent: MyBookingsPage_BookingsListItem, items: Sort(MainServerApp.GetOwnBookings(), $item => $item.StartDate)}),
    )
}
MyBookingsPage.notLoggedInPage = 'LoggedOutPage'

// AllBookingsPage.js
function AllBookingsPage_BookingsListItem(props) {
    const pathWith = name => props.path + '.' + name
    const parentPathWith = name => Elemento.parentPath(props.path) + '.' + name
    const {$item} = props
    const {Layout, TextElement, Calculation, Button} = Elemento.components
    const {DateFormat} = Elemento.globalFunctions
    const app = Elemento.useGetObjectState('app')
    const {ShowPage} = app
    const MainServerApp = Elemento.useGetObjectState('app.MainServerApp')
    const StartDate = Elemento.useObjectState(pathWith('StartDate'), new Calculation.State({value: DateFormat($item.StartDate, 'dd MMM yyyy')}))
    const FinishDate = Elemento.useObjectState(pathWith('FinishDate'), new Calculation.State({value: DateFormat($item.FinishDate, 'dd MMM yyyy')}))
    const ApproveButton_action = React.useCallback(async () => {
        await ShowPage(ApproveBookingPage, $item.id)
    }, [])

    return React.createElement(React.Fragment, null,
        React.createElement(Layout, {path: pathWith('BookingLayout'), horizontal: true, wrap: true},
            React.createElement(TextElement, {path: pathWith('UserName'), width: '10em'}, MainServerApp.GetUser($item.UserId).FirstName + ' ' + MainServerApp.GetUser($item.UserId).LastName),
            React.createElement(Calculation, {path: pathWith('StartDate'), label: 'Start Date', display: true, width: '8em'}),
            React.createElement(Calculation, {path: pathWith('FinishDate'), label: 'Finish Date', display: true, width: '8em'}),
            React.createElement(TextElement, {path: pathWith('Status'), width: '10em'}, $item.Status),
            React.createElement(Button, {path: pathWith('ApproveButton'), content: 'Approve', appearance: 'outline', action: ApproveButton_action}),
    ),
    )
}


function AllBookingsPage(props) {
    const pathWith = name => props.path + '.' + name
    const {Page, TextElement, ListElement} = Elemento.components
    const {Sort} = Elemento.globalFunctions
    const MainServerApp = Elemento.useGetObjectState('app.MainServerApp')
    const BookingsList = Elemento.useObjectState(pathWith('BookingsList'), new ListElement.State({}))

    return React.createElement(Page, {id: props.path},
        React.createElement(TextElement, {path: pathWith('Title'), fontSize: 22}, 'All Bookings'),
        React.createElement(ListElement, {path: pathWith('BookingsList'), itemContentComponent: AllBookingsPage_BookingsListItem, items: Sort(MainServerApp.GetAllBookings(), $item => $item.StartDate)}),
    )
}
AllBookingsPage.notLoggedInPage = 'LoggedOutPage'

// AddBookingPage.js
function AddBookingPage_AddBookingForm(props) {
    const pathWith = name => props.path + '.' + name
    const {Form, DateInput, Button} = Elemento.components
    const $form = Elemento.useGetObjectState(props.path)
    const StartDate = Elemento.useObjectState(pathWith('StartDate'), new DateInput.State({value: $form.originalValue?.StartDate}))
    const FinishDate = Elemento.useObjectState(pathWith('FinishDate'), new DateInput.State({value: $form.originalValue?.FinishDate}))
    $form._updateValue()
    const SaveButton_action = React.useCallback(async () => {
        await $form.Submit()
        //ShowPage(MyBookingsPage)
    }, [$form])

    return React.createElement(Form, props,
        React.createElement(DateInput, {path: pathWith('StartDate'), label: 'Start Date'}),
        React.createElement(DateInput, {path: pathWith('FinishDate'), label: 'Finish Date'}),
        React.createElement(Button, {path: pathWith('SaveButton'), content: 'Save', appearance: 'filled', action: SaveButton_action}),
    )
}


AddBookingPage_AddBookingForm.State = class AddBookingPage_AddBookingForm_State extends Elemento.components.BaseFormState {
    ownFieldNames = ['StartDate', 'FinishDate']
}


function AddBookingPage(props) {
    const pathWith = name => props.path + '.' + name
    const {Page} = Elemento.components
    const MainServerApp = Elemento.useGetObjectState('app.MainServerApp')
    const AddBookingForm_submitAction = React.useCallback(async ($form, $data) => {
        await MainServerApp.AddBooking($form)
    }, [])
    const AddBookingForm = Elemento.useObjectState(pathWith('AddBookingForm'), new AddBookingPage_AddBookingForm.State({submitAction: AddBookingForm_submitAction}))

    return React.createElement(Page, {id: props.path},
        React.createElement(AddBookingPage_AddBookingForm, {path: pathWith('AddBookingForm'), label: 'Add Booking', horizontal: false, wrap: false}),
    )
}
AddBookingPage.notLoggedInPage = 'LoggedOutPage'

// UpdateBookingPage.js
function UpdateBookingPage_UpdateBookingForm(props) {
    const pathWith = name => props.path + '.' + name
    const {Form, DateInput} = Elemento.components
    const $form = Elemento.useGetObjectState(props.path)
    const StartDate = Elemento.useObjectState(pathWith('StartDate'), new DateInput.State({value: $form.originalValue?.StartDate}))
    const FinishDate = Elemento.useObjectState(pathWith('FinishDate'), new DateInput.State({value: $form.originalValue?.FinishDate}))
    $form._updateValue()

    return React.createElement(Form, props,
        React.createElement(DateInput, {path: pathWith('StartDate'), label: 'Start Date'}),
        React.createElement(DateInput, {path: pathWith('FinishDate'), label: 'Finish Date'}),
    )
}


UpdateBookingPage_UpdateBookingForm.State = class UpdateBookingPage_UpdateBookingForm_State extends Elemento.components.BaseFormState {
    ownFieldNames = ['StartDate', 'FinishDate']
}


function UpdateBookingPage(props) {
    const pathWith = name => props.path + '.' + name
    const {Page, Calculation, Button} = Elemento.components
    const app = Elemento.useGetObjectState('app')
    const {CurrentUrl, ShowPage} = app
    const MainServerApp = Elemento.useGetObjectState('app.MainServerApp')
    const BookingId = Elemento.useObjectState(pathWith('BookingId'), new Calculation.State({value: CurrentUrl().pathSections[0]}))
    const Booking = Elemento.useObjectState(pathWith('Booking'), new Calculation.State({value: MainServerApp.GetOwnBooking(BookingId)}))
    const UpdateBookingForm_submitAction = React.useCallback(async ($form, $data) => {
        await MainServerApp.UpdateBooking(Booking.value.id, $form)
    }, [Booking])
    const UpdateBookingForm = Elemento.useObjectState(pathWith('UpdateBookingForm'), new UpdateBookingPage_UpdateBookingForm.State({value: Booking, submitAction: UpdateBookingForm_submitAction}))
    const SaveButton_action = React.useCallback(async () => {
        await UpdateBookingForm.Submit()
        await ShowPage('previous')
    }, [UpdateBookingForm])

    return React.createElement(Page, {id: props.path},
        React.createElement(Calculation, {path: pathWith('BookingId'), display: false}),
        React.createElement(Calculation, {path: pathWith('Booking'), display: false}),
        React.createElement(UpdateBookingPage_UpdateBookingForm, {path: pathWith('UpdateBookingForm'), label: 'Update Booking', horizontal: false, wrap: false}),
        React.createElement(Button, {path: pathWith('SaveButton'), content: 'Save', appearance: 'filled', action: SaveButton_action}),
    )
}
UpdateBookingPage.notLoggedInPage = 'LoggedOutPage'

// CancelBookingPage.js
function CancelBookingPage_CancelBookingForm(props) {
    const pathWith = name => props.path + '.' + name
    const {Form, DateInput} = Elemento.components
    const $form = Elemento.useGetObjectState(props.path)
    const StartDate = Elemento.useObjectState(pathWith('StartDate'), new DateInput.State({value: $form.originalValue?.StartDate}))
    const FinishDate = Elemento.useObjectState(pathWith('FinishDate'), new DateInput.State({value: $form.originalValue?.FinishDate}))
    $form._updateValue()

    return React.createElement(Form, props,
        React.createElement(DateInput, {path: pathWith('StartDate'), label: 'Start Date', readOnly: true}),
        React.createElement(DateInput, {path: pathWith('FinishDate'), label: 'Finish Date', readOnly: true}),
    )
}


CancelBookingPage_CancelBookingForm.State = class CancelBookingPage_CancelBookingForm_State extends Elemento.components.BaseFormState {
    ownFieldNames = ['StartDate', 'FinishDate']
}


function CancelBookingPage(props) {
    const pathWith = name => props.path + '.' + name
    const {Page, Calculation, Button} = Elemento.components
    const app = Elemento.useGetObjectState('app')
    const {CurrentUrl, ShowPage} = app
    const MainServerApp = Elemento.useGetObjectState('app.MainServerApp')
    const BookingId = Elemento.useObjectState(pathWith('BookingId'), new Calculation.State({value: CurrentUrl().pathSections[0]}))
    const Booking = Elemento.useObjectState(pathWith('Booking'), new Calculation.State({value: MainServerApp.GetOwnBooking(BookingId)}))
    const CancelBookingForm_submitAction = React.useCallback(async ($form, $data) => {
        await MainServerApp.CancelBooking(Booking.value.id)
    }, [Booking])
    const CancelBookingForm = Elemento.useObjectState(pathWith('CancelBookingForm'), new CancelBookingPage_CancelBookingForm.State({value: Booking, submitAction: CancelBookingForm_submitAction}))
    const ConfirmButton_action = React.useCallback(async () => {
        await CancelBookingForm.Submit()
        await ShowPage('previous')
    }, [CancelBookingForm])

    return React.createElement(Page, {id: props.path},
        React.createElement(Calculation, {path: pathWith('BookingId'), display: false}),
        React.createElement(Calculation, {path: pathWith('Booking'), display: false}),
        React.createElement(CancelBookingPage_CancelBookingForm, {path: pathWith('CancelBookingForm'), label: 'Cancel Booking', readOnly: true, horizontal: false, wrap: false}),
        React.createElement(Button, {path: pathWith('ConfirmButton'), content: 'Confirm Cancel', appearance: 'filled', action: ConfirmButton_action}),
    )
}
CancelBookingPage.notLoggedInPage = 'LoggedOutPage'

// ApproveBookingPage.js
function ApproveBookingPage_ApproveBookingForm(props) {
    const pathWith = name => props.path + '.' + name
    const {Form, DateInput, TextInput} = Elemento.components
    const $form = Elemento.useGetObjectState(props.path)
    const StartDate = Elemento.useObjectState(pathWith('StartDate'), new DateInput.State({value: $form.originalValue?.StartDate}))
    const FinishDate = Elemento.useObjectState(pathWith('FinishDate'), new DateInput.State({value: $form.originalValue?.FinishDate}))
    const Status = Elemento.useObjectState(pathWith('Status'), new TextInput.State({value: $form.originalValue?.Status}))
    $form._updateValue()

    return React.createElement(Form, props,
        React.createElement(DateInput, {path: pathWith('StartDate'), label: 'Start Date', readOnly: true}),
        React.createElement(DateInput, {path: pathWith('FinishDate'), label: 'Finish Date', readOnly: true}),
        React.createElement(TextInput, {path: pathWith('Status'), label: 'Status'}),
    )
}


ApproveBookingPage_ApproveBookingForm.State = class ApproveBookingPage_ApproveBookingForm_State extends Elemento.components.BaseFormState {
    ownFieldNames = ['StartDate', 'FinishDate', 'Status']
}


function ApproveBookingPage(props) {
    const pathWith = name => props.path + '.' + name
    const {Page, Calculation, Button} = Elemento.components
    const app = Elemento.useGetObjectState('app')
    const {CurrentUrl, ShowPage} = app
    const MainServerApp = Elemento.useGetObjectState('app.MainServerApp')
    const BookingId = Elemento.useObjectState(pathWith('BookingId'), new Calculation.State({value: CurrentUrl().pathSections[0]}))
    const Booking = Elemento.useObjectState(pathWith('Booking'), new Calculation.State({value: MainServerApp.GetBooking(BookingId)}))
    const ApproveBookingForm_submitAction = React.useCallback(async ($form, $data) => {
        await MainServerApp.ApproveBooking(Booking.value.id)
    }, [Booking])
    const ApproveBookingForm = Elemento.useObjectState(pathWith('ApproveBookingForm'), new ApproveBookingPage_ApproveBookingForm.State({value: Booking, submitAction: ApproveBookingForm_submitAction}))
    const ApproveButton_action = React.useCallback(async () => {
        await ApproveBookingForm.Submit()
        await ShowPage('previous')
    }, [ApproveBookingForm])

    return React.createElement(Page, {id: props.path},
        React.createElement(Calculation, {path: pathWith('BookingId'), display: false}),
        React.createElement(Calculation, {path: pathWith('Booking'), display: false}),
        React.createElement(ApproveBookingPage_ApproveBookingForm, {path: pathWith('ApproveBookingForm'), label: 'Approve Booking', readOnly: true, horizontal: false, wrap: false}),
        React.createElement(Button, {path: pathWith('ApproveButton'), content: 'Approve', appearance: 'filled', action: ApproveButton_action}),
    )
}
ApproveBookingPage.notLoggedInPage = 'LoggedOutPage'

// LoggedOutPage.js
function LoggedOutPage(props) {
    const pathWith = name => props.path + '.' + name
    const {Page, TextElement} = Elemento.components

    return React.createElement(Page, {id: props.path},
        React.createElement(TextElement, {path: pathWith('Text3'), fontSize: 20}, 'Please log in to continue'),
    )
}

// appMain.js
function configMainServerApp() {
    return {
        appName: 'Main Server App',
        url: '/capi/:versionId/MainServerApp',

        functions: {
            AddBooking: {
                params: ['BookingDetails'],
                action: true
            },

            UpdateBooking: {
                params: ['Id', 'BookingUpdates'],
                action: true
            },

            CancelBooking: {
                params: ['Id'],
                action: true
            },

            GetOwnBookings: {
                params: []
            },

            GetOwnBooking: {
                params: ['BookingId']
            },

            GetBooking: {
                params: ['BookingId']
            },

            GetOwnUser: {
                params: []
            },

            GetAllBookings: {
                params: []
            },

            ApproveBooking: {
                params: ['Id'],
                action: true
            },

            GetUser: {
                params: ['Id']
            }
        }
    };
}

export default function MainApp(props) {
    const pathWith = name => 'MainApp' + '.' + name
    const {App, ServerAppConnector, AppBar, Button, UserLogon} = Elemento.components
    const {And} = Elemento.globalFunctions
    const pages = {MyBookingsPage, AllBookingsPage, AddBookingPage, UpdateBookingPage, CancelBookingPage, ApproveBookingPage, LoggedOutPage}
    const {appContext} = props
    const app = Elemento.useObjectState('app', new App.State({pages, appContext}))
    const {ShowPage} = app
    const {CurrentUser} = Elemento.appFunctions
    const MainServerApp = Elemento.useObjectState('app.MainServerApp', new ServerAppConnector.State({configuration: configMainServerApp()}))
    const MyBookingsButton_action = React.useCallback(async () => {
        await MainServerApp.Refresh('GetOwnBookings')
        await ShowPage(MyBookingsPage)
    }, [MainServerApp])
    const AllBookings_action = React.useCallback(async () => {
        await MainServerApp.Refresh('GetAllBookings')
        await ShowPage(AllBookingsPage)
    }, [MainServerApp])

    return React.createElement(App, {path: 'MainApp', topChildren: React.createElement( React.Fragment, null, React.createElement(AppBar, {path: pathWith('MainAppBar'), title: 'Holiday Bookings'},
            React.createElement(Button, {path: pathWith('MyBookingsButton'), content: 'My Bookings', appearance: 'filled', action: MyBookingsButton_action}),
            React.createElement(Button, {path: pathWith('AllBookings'), content: 'All Bookings', appearance: 'filled', display: And(CurrentUser(), MainServerApp.GetOwnUser()?.Approver), action: AllBookings_action}),
            React.createElement(UserLogon, {path: pathWith('UserLogon2')}),
    ))
    },)
}
