const apiUrl = "http://50.21.176.153:2100/api";
const conSucessdb = JSON.parse(localStorage.getItem("connection"));
const userData = JSON.parse(localStorage.getItem("logindata"));
var hotlistArray = JSON.parse(localStorage.getItem("hotlist"));
const searchdata = JSON.parse(window?.localStorage?.getItem("searchData"));
const nearestProfileSort = JSON.parse(window?.localStorage?.getItem("nearestProfileSort"));
const userObj = JSON.parse(localStorage.getItem("userObj"));
const searchResult = JSON.parse(localStorage.getItem("searchResult"));
const loader = document.querySelector("#main-loader");
let x = 1;
let loadMore = false;
if (searchResult) { loadMore = true; }

const hideSpinner = () => {
    loader.style.display = "none";
}

const showSpinner = () => {
    loader.style.display = "flex";
}

const getMobileOS = () => {
    const ua = navigator.userAgent
    if (/android/i.test(ua)) {
        return "Android"
    }
    else if ((/iPad|iPhone|iPod/.test(ua)) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
        return "iOS"
    }
    return "Other"
}

const mobileVersion = getMobileOS();

const help = () => {
    document.getElementById("helpCompany").innerHTML = userData?.Compnany;
    document.getElementById("helpDbName").innerHTML = userData?.DatabaseName;
    document.getElementById("helpdbSize").innerHTML = userData?.TotalProfile;
    document.getElementById("helpMobVersion").innerHTML = mobileVersion;
}

const urlConnection = () => {
    const url = document.getElementById("inputUrl")?.value;
    if (!url || url.trim() === "") {
        if(conSucessdb?.success === true){
            localStorage?.removeItem("connection")
        }
        document.getElementById("conmobileVersion").innerHTML = mobileVersion;
        document.getElementById("connectionFail").style.display = "block";
        return;
    }
    showSpinner()
    fetch(url + "/api/user/online")
        .then(response => response?.json())
        .catch((error) => {
            hideSpinner();
            localStorage.removeItem("connection");
            const conFail = document.getElementById("connectionFail");
            document.getElementById("conmobileVersion").innerHTML = mobileVersion;
            conFail.style.display = "block";
        })
        .then((response) => {
            hideSpinner();
            const conSucess = document.getElementById("connectionUrl");
            const conFail = document.getElementById("connectionFail");
            if (response.success) {
                conSucess.style.display = "block";
                document.getElementById("conDatabase").innerHTML = response?.DatabaseName;
                document.getElementById("conurlString").innerHTML = url;
                document.getElementById("mobileVersion").innerHTML = mobileVersion;
                const conObj = {
                    success: response.success,
                    url: url
                }
                window?.localStorage?.setItem("connection", JSON.stringify(conObj));

            } else {
                document.getElementById("conmobileVersion").innerHTML = mobileVersion;
                conFail.style.display = "block";
            }
        })
}

const connectionSuccess = () => {
    document.getElementById("modalconnectionBtn").style.display = "none";
    window.location.replace("index.html")
}

const connectionFalse = () => {
    window.location.reload();
}

const userLogin = () => {
    const api = apiUrl + "/User/GetUserInfo";
    const username = document.getElementById("username")?.value;
    const password = document.getElementById("password")?.value;

    if (!username || username.trim() === "") {
        document.getElementById("logMobileFalse").innerHTML = mobileVersion;
        document.getElementById("loginFalse").style.display = "block";
        return;
    } if (!password || password.trim() === "") {
        document.getElementById("logMobileFalse").innerHTML = mobileVersion;
        document.getElementById("loginFalse").style.display = "block";
        return;
    }

    const data = {};
    data.Username = username;
    data.Password = password;
    const requestOptions = {
        method: "POST",
        body:
            JSON.stringify(data),

        headers: {
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    }
    showSpinner()
    fetch(api, requestOptions)
        .then(response => response?.json())
        .catch((error) => { console.log(error, "err"); })
        .then((response) => {
            hideSpinner()
            const logSucess = document.getElementById("loginSuccess");
            const logFail = document.getElementById("loginFalse");
            if (conSucessdb?.success === true) {
                if (response.Success) {
                    localStorage.setItem("logindata", JSON.stringify(response?.Data));
                    logSucess.style.display = "block";
                    document.getElementById("userId").innerHTML = response?.Data?.UserID;
                    document.getElementById("userCompany").innerHTML = response?.Data?.Compnany;
                    document.getElementById("dbName").innerHTML = response?.Data?.DatabaseName;
                    document.getElementById("dbSize").innerHTML = response?.Data?.TotalProfile;
                    document.getElementById("logMobile").innerHTML = mobileVersion;

                } else {
                    document.getElementById("logMobileFalse").innerHTML = mobileVersion;
                    logFail.style.display = "block";
                }
            } else {
                hideSpinner()
                document.getElementById("connectionFail").style.display = "block";
            }
        })
}

const logfalse = () => {
    document.getElementById("loginFalse").style.display = "none";
}

const logsuccess = () => {
    window.location.replace("search.html")
}

const signOff = () => {
    window.location.replace("index.html");
    localStorage.removeItem("logindata");
    localStorage.removeItem("search");
    localStorage.removeItem("userObj");
    localStorage.removeItem("resume");
    localStorage.removeItem("searchResult");
    localStorage.removeItem("searchData");
    localStorage.removeItem("nearestProfileSort");
    localStorage.removeItem("url");
    localStorage.removeItem("mailto");
}

const initIndex = () => {
    localStorage.removeItem("logindata");
    localStorage.removeItem("search");
    localStorage.removeItem("userObj");
    localStorage.removeItem("resume");
    localStorage.removeItem("searchResult");
    localStorage.removeItem("searchData");
    localStorage.removeItem("nearestProfileSort");
    localStorage.removeItem("url");
    localStorage.removeItem("mailto");
}

const showSortModal = () => {
    const search = localStorage.getItem("searchResult");
    if (search?.length) {
        const anchor = document.getElementById("sortModal");
        anchor.href = "javascript:void(0)"
        $(document).ready(function () {
            $("#sortBtn").modal("show");
        })
    } else {
        const anchor = document.getElementById("sortModal");
        anchor.href = "javascript:void(0)"
        const error = document.getElementById("error-msg");
        error.innerHTML = "Please Search something before sort"
        $(document).ready(function () {
            $("#errorModal").modal("show");
        })
    }
}

const searchOn = () => {
    const api = apiUrl + "/User/SearchProfile";
    const search = document.getElementById("searchInput")?.value;
    if (!search || search?.trim() === "") {
        const oldUserList = document.querySelectorAll('#userList');
        for (let i = 0; i < oldUserList?.length; i++) {
            oldUserList[i].remove();
        }
    }
    if (!search || search?.trim() === "") {
        // const error = document.getElementById("error-msg");
        // error.innerHTML = "Please type keyword before you can search"
        // $(document).ready(function () {
        //     $("#errorModal").modal("show");
        // })
        return;
    }
    localStorage.setItem("search", search?.trim());
    const data = {};
    const userid = JSON.parse(localStorage.getItem("logindata"))?.UserID
    data.UserID = userid;
    data.NoOfRow = 20;
    data.PageNumber = x;
    x += 1;
    data.TotalRecord = 1;
    data.Search = search?.trim();
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    }
    if (loadMore) {
        showSpinner()
        fetch(api, requestOptions)
            .then(response => response?.json())
            .catch((error) => { console.log(error, "err"); })
            .then((response) => {
                hideSpinner();
                if (response?.length > 0) {
                    const oldData = JSON.parse(localStorage.getItem("searchResult") || '[]');
                    for (let i = 0; i < response.length; i++) {
                        oldData.push(response[i]);
                    }
                    localStorage.setItem("searchResult", JSON.stringify(oldData));
                    response?.map((item) => {
                        const newData = document.getElementById("dataid")
                        const li = document.createElement('li');
                        li.id = "userList"
                        const anchor = document.createElement('a');
                        if (item?.Proty === "A") {
                            anchor.classList.add("typeUser");
                        }
                        if (item?.Proty === "C") {
                            anchor.classList.add("typeClient");
                        }
                        anchor.innerHTML = '<i class="fa fa-address-card"></i>' + ' ' + item?.Prosex + ' ' + item?.Profn + ' ' + item?.Proln;
                        anchor.addEventListener('click', function () {
                            getProfile(item);
                        });
                        li.append(anchor)
                        newData.append(li);
                    })
                } else {
                    loadMore = false;
                    // const error = document.getElementById("error-msg");
                    // error.innerHTML = "No More Record Found"
                    // $(document).ready(function () {
                    //     $("#errorModal").modal("show");
                    // })
                    return;
                }
            })
    }
}

// pagination
$('#middleSection').on('scroll', function () {
    let div = $(this).get(0);
    if (div.scrollTop + div.clientHeight >= div.scrollHeight) {
        searchOn();
    }
});

const searchOff = () => {
    const search = document.getElementById("searchInput")?.value;
    if (!search) {
        const error = document.getElementById("error-msg");
        error.innerHTML = "No data to clear"
        $(document).ready(function () {
            $("#errorModal").modal("show");
        })
        return;
    }

    const oldUserList = document.querySelectorAll('#userList');
    for (let i = 0; i < oldUserList?.length; i++) {
        oldUserList[i].remove();
    }
    localStorage.removeItem("search");
    localStorage.removeItem("url");
    localStorage.removeItem("userObj");
    localStorage.removeItem("resume");
    localStorage.removeItem("searchResult");
    localStorage.removeItem("nearestProfileSort");
    localStorage.removeItem("mailto");
    document.getElementById("searchInput").value = "";
    x = 1;


}

const initLastNote = () => {
    let data = searchResult.filter(item => item?.Notes[0]?.Ntpdt)
    let recentNotes = data.sort(function (a, b) {
        return new Date(b.Notes[0]?.Ntpdt) - new Date(a.Notes[0]?.Ntpdt);
    });
    if (userData) {
        if (recentNotes?.length) {
            recentNotes?.map((item) => {
                const newData = document.getElementById("sortdataid")
                const li = document.createElement('li');
                li.id = "userList"
                const anchor = document.createElement('a');
                if (item?.Proty === "A") {
                    anchor.classList.add("typeUser");
                }
                if (item?.Proty === "C") {
                    anchor.classList.add("typeClient");
                }
                anchor.innerHTML = `${item?.Prosex} ${item?.Profn} ${item?.Proln} [${moment(item?.Notes[0]?.Ntpdt).format("DD/MM/YYYY")}]`;
                anchor.addEventListener('click', function () {
                    getProfile(item);
                });
                li.append(anchor)
                newData.append(li);
            })
        }
    }
    else {
        window?.location?.replace('index.html');
    }

}

const initLastName = () => {
    let lastNameSort = searchResult.sort(function (a, b) { return (a.Proln > b.Proln ? 1 : (a.Proln === b.Proln ? 0 : -1)) })
    if (userData) {
        if (lastNameSort?.length) {
            lastNameSort?.map((item) => {
                const newData = document.getElementById("sortdataid")
                const li = document.createElement('li');
                li.id = "userList"
                const anchor = document.createElement('a');
                if (item?.Proty === "A") {
                    anchor.classList.add("typeUser");
                }
                if (item?.Proty === "C") {
                    anchor.classList.add("typeClient");
                }
                anchor.innerHTML = `${item?.Prosex} ${item?.Profn} ${item?.Proln} [${item?.Proln}]`;
                anchor.addEventListener('click', function () {
                    getProfile(item);
                });
                li.append(anchor)
                newData.append(li);
            })
        }
    }
    else {
        window?.location?.replace('index.html');
    }
}

const initRecordAgeDate = () => {
    let recordAgeSort = searchResult.sort(function (a, b) {
        return new Date(b.Prodt) - new Date(a.Prodt);
    });
    if (userData) {
        if (recordAgeSort?.length) {
            recordAgeSort?.map((item) => {
                const newData = document.getElementById("sortdataid");
                const li = document.createElement('li');
                li.id = "userList"
                const anchor = document.createElement('a');
                if (item?.Proty === "A") {
                    anchor.classList.add("typeUser");
                }
                if (item?.Proty === "C") {
                    anchor.classList.add("typeClient");
                }
                anchor.innerHTML = `${item?.Prosex} ${item?.Profn} ${item?.Proln} [${moment(item?.Prodt).format("DD/MM/YYYY")}]`;
                anchor.addEventListener('click', function () {
                    getProfile(item);
                });
                li.append(anchor)
                newData.append(li);
            })
        }
    }
    else {
        window?.location?.replace('index.html');
    }
}

const initRecordUpdateDate = () => {
    let recordUpdateSort = searchResult.sort(function (a, b) {
        return new Date(b.ProStamp) - new Date(a.ProStamp);
    });
    if (userData) {
        if (recordUpdateSort?.length) {
            recordUpdateSort?.map((item) => {
                const newData = document.getElementById("sortdataid");
                const li = document.createElement('li');
                li.id = "userList"
                const anchor = document.createElement('a');
                if (item?.Proty === "A") {
                    anchor.classList.add("typeUser");
                }
                if (item?.Proty === "C") {
                    anchor.classList.add("typeClient");
                }
                anchor.innerHTML = `${item?.Prosex} ${item?.Profn} ${item?.Proln} [${moment(item?.ProStamp).format("DD/MM/YYYY")}] `;
                anchor.addEventListener('click', function () {
                    getProfile(item);
                });
                li.append(anchor)
                newData.append(li);
            })
        }
    }
    else {
        window?.location?.replace('index.html');
    }
}

const sortByZipCode = () => {
    const api = apiUrl + "/User/SearchNearestProfiles";
    const search = document.getElementById("searchInput")?.value;
    if (!search || search?.trim() === "") {
        const error = document.getElementById("error-msg");
        error.innerHTML = "Please enter Zip Code"
        $(document).ready(function () {
            $("#errorModal").modal("show");
        })
        return;
    }

    const zipcode = document.getElementById("zipcodeId")?.value;
    const data = {};
    data.NoOfRow = 50;
    data.PageNumber = 1;
    data.Search = search;
    data.Zip = zipcode;
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    }
    showSpinner();
    fetch(api, requestOptions)
        .then(response => response?.json())
        .catch((error) => { console.log(error, "err"); })
        .then((response) => {
            hideSpinner();
            if (response) {
                if (response?.Message === "Successfully") {
                    if (response?.Data?.length > 0) {
                        localStorage?.setItem("nearestProfileSort", JSON.stringify(response?.Data));
                        window?.location?.replace("zipSort.html");
                    }
                    else {
                        const error = document.getElementById("error-msg");
                        error.innerHTML = "No Record Found"
                        $(document).ready(function () {
                            $("#errorModal").modal("show");
                        })
                    }
                } else {
                    const error = document.getElementById("error-msg");
                    error.innerHTML = response?.Message
                    $(document).ready(function () {
                        $("#errorModal").modal("show");
                    })
                }
            }
        })
}

const initZipCode = () => {
    if (userData) {
        if (nearestProfileSort?.length) {
            nearestProfileSort?.filter(item => item?.ProDistance != null)?.map((item) => {
                const newData = document.getElementById("sortdataid");
                const li = document.createElement('li');
                li.id = "userList"
                const anchor = document.createElement('a');
                if (item?.Proty === "A") {
                    anchor.classList.add("typeUser");
                }
                if (item?.Proty === "C") {
                    anchor.classList.add("typeClient");
                }
                anchor.innerHTML = `${item?.Prosex} ${item?.Profn} ${item?.Proln} [${item?.ProDistance} miles]`;
                anchor.addEventListener('click', function () {
                    getProfile(item);
                });
                li.append(anchor)
                newData.append(li);
            })
        }
    }
    else {
        window?.location?.replace('index.html');
    }

}

const floppy = () => {
    const search = document.getElementById("searchInput")?.value;
    if (search === "" || search.trim() === "") {
        const error = document.getElementById("error-msg");
        error.innerHTML = "Please search before you can save hotlist"
        $(document).ready(function () {
            $("#errorModal").modal("show");
        })
        return;
    };

    const heading = document.getElementById("addHotlistHeading");
    heading.innerHTML = search;
    $(document).ready(function () {
        $("#addHotlist").modal("show");
    })
}

const saveToHotlist = () => {
    const id = Math.random().toString();
    const search = document.getElementById("searchInput")?.value;
    const description = document.getElementById("addHotlistInput")?.value;
    if (description === "" || description.trim() === "") {
        const error = document.getElementById("error-msg");
        error.innerHTML = "Please Enter Description"
        $(document).ready(function () {
            $("#errorModal").modal("show");
        })
        return;
    };
    let hotlistarr = [];
    let hotlistData = {
        id: id,
        data: search,
        desc: description,
    };
    const hotlistget = JSON.parse(window?.localStorage.getItem("hotlist"));
    if (hotlistget) {
        hotlistarr = JSON.parse(window?.localStorage.getItem("hotlist"));
        hotlistarr.push(hotlistData);
        window?.localStorage?.setItem("hotlist", JSON.stringify(hotlistarr));
    } else {
        hotlistarr.push(hotlistData);
        window?.localStorage?.setItem("hotlist", JSON.stringify(hotlistarr));
    }
    window.location.replace("hotlist.html")

}

const hotlistAppend = () => {
    hotlistArray?.map(item => {
        const ul = document.getElementById("hotlistData");
        const li = document.createElement('li');
        li.className = "hotlist-items"
        const anchor = document.createElement('a');
        const span = document.createElement('span');
        anchor.href = "#";
        anchor.classList.add = "float-right";
        anchor.innerHTML = '<i class="fa fa-times"></i></a>'
        span.innerHTML = `${item?.data} (${item?.desc})`;
        li.append(span)
        li.append(anchor);
        ul.append(li);
        span.addEventListener('click', function () {
            window?.location?.replace("search.html");
            window?.localStorage?.setItem("searchData", JSON.stringify(item?.data));
        });
        anchor.addEventListener('click', function () {
            remove(item);
        });
    })
}

const remove = (item) => {
    const filteredHotlist = hotlistArray?.filter(i => i?.id !== item?.id);
    window?.localStorage?.setItem("hotlist", JSON.stringify(filteredHotlist));
    const oldUserLi = document.querySelectorAll('.hotlist-items');
    for (let i = 0; i < oldUserLi?.length; i++) {
        oldUserLi[i].remove();
    }
    hotlistArray = filteredHotlist;
    hotlistAppend();
    prj();
}

const searchfromHotlist = () => {
    if (searchdata) {
        const search = document.getElementById("searchInput");
        search.value = searchdata;
        loadMore = true;
        searchOn();
    }
}

const searchChange = (e) => {
    loadMore = true;
    const ls = localStorage.getItem("search");
    const search = document.getElementById("searchInput")?.value;
    if (ls != search) {
        x = 1;
        const oldUserList = document.querySelectorAll('#userList');
        for (let i = 0; i < oldUserList?.length; i++) {
            oldUserList[i].remove();
        }
    }
    if (!search || search.trim() === "") {
        localStorage.removeItem("search");
        localStorage.removeItem("searchResult");
        const oldUserList = document.querySelectorAll('#userList');
        for (let i = 0; i < oldUserList?.length; i++) {
            oldUserList[i].remove();
        }
    }
}

const getProfile = (item) => {
    localStorage.setItem("url", window.location.href)
    localStorage?.setItem("userObj", JSON.stringify(item));
    window.location.replace("profile.html");
}

const backFromProfile = () => {
    const url = localStorage.getItem("url");
    localStorage.removeItem("mailto");
    window.location.replace(url);
    loadMore = false;
}

const initProfile = () => {
    showSpinner();
    if (userData) {
        document.getElementById("name-initials").innerHTML = userObj?.Profn.charAt(0) + userObj?.Proln.charAt(0);
        document.getElementById("profullname").innerHTML = userObj?.Profn + " " + userObj?.Proln;
        document.getElementById("protype").innerHTML = userObj?.Proty ? userObj?.Proty : "";
        document.getElementById("prostatus").innerHTML = userObj?.Prosta ? userObj?.Prosta : '';
        document.getElementById("projobcd").innerHTML = userObj?.Projt ? userObj?.Projt : '';
        document.getElementById("proskill").innerHTML = userObj?.Proskt ? userObj?.Proskt : '';
        document.getElementById("proindustry").innerHTML = userObj?.Proind ? userObj?.Proind : '';
        document.getElementById("prokeyword").innerHTML = `${userObj?.Prokw1 !== null ? userObj?.Prokw1 : ""} ${userObj?.Prokw2 !== null ? userObj?.Prokw2 : ""}`;
        document.getElementById("projobtitle").innerHTML = userObj?.Prottl ? userObj?.Prottl : '';
        document.getElementById("procurrcompany").innerHTML = userObj?.Procn ? userObj?.Procn : '';
        document.getElementById("prorecorddate").innerHTML = moment(userObj?.ProStamp ? userObj?.ProStamp : '').format("MM/DD/YY");
        document.getElementById("prohome").innerHTML = userObj?.Prohnum ? userObj?.Prohnum : '';
        document.getElementById("promobile").innerHTML = userObj?.ProCell ? userObj?.ProCell : '';
        document.getElementById("propublicwork").innerHTML = userObj?.Progonum ? userObj?.Progonum : '';
        document.getElementById("proprivatework").innerHTML = userObj?.Prodonum ? userObj?.Prodonum : ''
        document.getElementById("proemail").innerHTML = userObj?.ProEmail ? userObj?.ProEmail.toLowerCase() : '';
        document.getElementById("proaddress").innerHTML = `${userObj?.Proadr ? userObj?.Proadr : ''} ${userObj?.Procty ? userObj?.Procty : ''} ${userObj?.Prost ? userObj?.Prost : ''} ${userObj?.Prozip ? userObj?.Prozip : ''}`;
        document.getElementById("prosalary").innerHTML = userObj?.Prosal ? userObj?.Prosal : '';
        document.getElementById("prosalarydate").innerHTML = moment(userObj?.Prosaldt ? userObj?.Prosaldt : '').format("MM/DD/YY");
        if (userObj.ProRelocation === false) { document.getElementById("prorelocation").innerHTML = "NO" } else { document.getElementById("prorelocation").innerHTML = "YES" }
        document.getElementById("procitizen").innerHTML = userObj?.ProCitizen
        if (userObj.ProCitizen === true) { document.getElementById("procitizen").innerHTML = "YES" } else { document.getElementById("procitizen").innerHTML = "NO" }
        document.getElementById("dloc").innerHTML = userObj?.ProDesLocation ? userObj?.ProDesLocation : ''
        document.getElementById("dpos").innerHTML = userObj?.ProDesPosition ? userObj?.ProDesPosition : ''
        document.getElementById("dsal").innerHTML = userObj?.ProDesSalary ? userObj?.ProDesSalary : ''
        document.getElementById("doyear").innerHTML = userObj?.ProDegreeYr ? userObj?.ProDegreeYr : ''
        document.getElementById("efyear").innerHTML = userObj?.ProExpFromYr ? userObj?.ProExpFromYr : ''
        document.getElementById("prorecruiter").innerHTML = userObj?.Prorctr ? userObj?.Prorctr : ''
        if (userObj?.Notes?.length) {
            userObj?.Notes?.slice(0, 5)?.map(item => {
                const div = document.getElementById("notedata")
                const ndate = document.createElement("h5");
                ndate.innerHTML = moment(item?.Ntpdt).format("MM/DD/YY");
                const nmsg = document.createElement("p");
                nmsg.innerHTML = item?.Ntpnar;
                div.append(ndate);
                div.append(nmsg);
            })
        }
        const procall = document.getElementById("procall");
        procall.addEventListener('click', function () {
            if (userObj?.Prohnum) {
                procall.href = "tel:" + userObj?.Prohnum;
            } else {
                const error = document.getElementById('error-msg');
                error.innerHTML = "Contact number not found."
                $(document).ready(function () {
                    $("#errorModal").modal("show");
                })
            }
        })
        const prowebsite = document.getElementById("prowebsite");
        prowebsite.href = userObj?.ProUrl;
        const promail = document.getElementById("promail");
        promail.addEventListener('click', function () {
            if (userObj?.ProEmail) {
                promail.href = "mailto:" + userObj?.ProEmail;
            } else {
                const error = document.getElementById('error-msg');
                error.innerHTML = "No Email found."
                $(document).ready(function () {
                    $("#errorModal").modal("show");
                })
            }
        })
        const promessage = document.getElementById("promessage");
        promessage.addEventListener('click', function () {
            $(document).ready(function () {
                $("#smsModal").modal("show");
            })
        })
        openResume();
        hideSpinner();
    }
    else {
        window?.location?.replace('index.html');
    }
}

const sendSms = () => {
    const smsBody = document.getElementById("smsBody").value;
    const sendBtn = document.getElementById("sendSms");
    if (!smsBody || smsBody.trim() === "") {
        sendBtn.href = "#";
        const error = document.getElementById("error-msg-sms");
        error.innerHTML = "Please write message text "
        $(document).ready(function () {
            $("#errorSmsModal").modal("show");
        })
    } else {
        if (mobileVersion === "Android") {
            sendBtn.href = "sms:" + userObj?.Prohnum + "?body=" + smsBody;
        } else {
            sendBtn.href = "sms://" + userObj?.Prohnum + "/&body=" + smsBody;
        }
        saveNoteSms();
        $(document).ready(function () {
            $("#smsModal").modal("hide");
        })
    }
}

const saveNoteSms = () => {
    const api = apiUrl + "/User/SaveNotes";
    const userid = JSON.parse(localStorage.getItem("logindata"))?.UserID
    const smsBody = document.getElementById("smsBody").value;
    const data = {};
    data.UserId = userid;
    data.ProSer = userObj?.ProSer;
    data.NoteType = "sms";
    data.MessageText = smsBody;
    data.NoteDate = new Date();
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    }
    fetch(api, requestOptions)
        .then(response => response?.json())
        .catch((error) => { console.log(error, "err"); })
        .then((response) => {
        })
}

const appendResult = () => {
    showSpinner();
    searchResult?.map((item) => {
        hideSpinner();
        const newData = document.getElementById("dataid")
        const li = document.createElement('li');
        li.id = "userList"
        const anchor = document.createElement('a');
        if (item?.Proty === "A") {
            anchor.classList.add("typeUser");
        }
        if (item?.Proty === "C") {
            anchor.classList.add("typeClient");
        }
        anchor.innerHTML = '<i class="fa fa-address-card"></i>' + ' ' + item?.Prosex + ' ' + item?.Profn + ' ' + item?.Proln;
        anchor.addEventListener('click', function () {
            getProfile(item);
        });
        li.append(anchor)
        newData.append(li);
    })
}

const initSearch = () => {
    if (userData) {
        const oldUserList = document.querySelectorAll('#userList');
        for (let i = 0; i < oldUserList?.length; i++) {
            oldUserList[i].remove();
        }
        if (searchResult) {
            appendResult();
        }
        document.getElementById("searchInput").value = localStorage.getItem("search")
        // searchfromHotlist();
        localStorage.removeItem("searchData")
        localStorage.removeItem("userObj")
        localStorage.removeItem("resume")
        localStorage.removeItem("mailto");
    }
    else {
        window?.location?.replace('index.html');
    }
}

const prj = () => {
    const api = apiUrl + "/User/SearchHotlist";
    const data = {};
    const userid = JSON.parse(localStorage.getItem("logindata"))?.UserID
    data.UserID = userid;
    data.NoOfRow = 100;
    data.PageNumber = 1;
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    }
    showSpinner();
    fetch(api, requestOptions)
        .then(response => response?.json())
        .catch((error) => { console.log(error, "err"); })
        .then((response) => {
            hideSpinner();
            response?.map((item) => {
                const ul = document.getElementById("prj-ul")
                const li = document.createElement('li');
                li.className = "hotlist-items"
                li.innerHTML = `${item?.PrjQueryName} (${item?.PrjName})`;
                ul.append(li);
                li.addEventListener('click', function () {
                    HotlistbyId(item)
                });
            })
        })
}

const HotlistbyId = (item) => {
    const api = apiUrl + "/User/SearchHotlistbyId";
    const data = {};
    const userid = JSON.parse(localStorage.getItem("logindata"))?.UserID
    data.UserId = userid;
    data.PrjSerId = item?.PrjSer;
    data.PrjType = item?.PrjType;

    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    }
    showSpinner();
    fetch(api, requestOptions)
        .then(response => response?.json())
        .catch((error) => { console.log(error, "err"); })
        .then((response) => {
            hideSpinner();
            if (response?.length > 0) {
                localStorage.setItem("searchResult", JSON.stringify(response))
                window?.localStorage?.setItem("search", item?.PrjQueryName);
                window.location.replace("search.html");
            }
            else {
                const error = document.getElementById("error-msg");
                error.innerHTML = "No Record Found"
                $(document).ready(function () {
                    $("#errorModal").modal("show");
                })
            }
        })
}

// const mailResume = () => {
//     const oldUserList = document.querySelectorAll('#cont-div');
//     for (let i = 0; i < oldUserList?.length; i++) {
//         oldUserList[i].remove();
//     }
//     $(document).ready(function () {
//         $("#emailResume").modal("show");
//     })
//     const api = apiUrl + "/User/GetJobUserList";
//     const data = {};
//     data.NoOfRow = 10;
//     data.PageNumber = 1;
//     const requestOptions = {
//         method: "POST",
//         body: JSON.stringify(data),
//         headers: {
//             "Content-type": "application/json",
//             "Access-Control-Allow-Origin": "*"
//         }
//     }
//     fetch(api, requestOptions)
//         .then(response => response?.json())
//         .catch((error) => { console.log(error, "err"); })
//         .then((response) => {
//             const users = response?.Data

//             if (users?.length > 0) {
//                 users.map(item => {
//                     const newData = document.getElementById("userDiv");
//                     const div = document.createElement('div');
//                     div.id = "cont-div"
//                     const input = document.createElement('input');
//                     input.className = "form-check-input";
//                     input.type = "checkbox";
//                     input.value = item?.JobEmail + "/" + item?.JobSer;
//                     input.name = 'Resumes';
//                     input.addEventListener('change', function () {
//                         const data = document.getElementsByName('Resumes')
//                         var result = "";
//                         var arr = [];

//                         for (var i = 0; i < data.length; i++) {
//                             if (data[i].checked) {
//                                 result += "," + data[i].value;
//                                 var obj1 = {
//                                     JobEmail: "",
//                                     JobSer: 0
//                                 }
//                                 obj1.JobEmail = data[i].value.split("/")[0];
//                                 obj1.JobSer = Number(data[i].value.split("/")[1]);
//                                 arr = [...arr, obj1];

//                             }
//                         }
//                         var emailData = result.substring(1);
//                         let res = [];
//                         res = users.filter(el => {
//                             return arr.find(element => {
//                                 return element.JobSer === el.JobSer;
//                             });
//                         });
//                         if (emailData) {
//                             const button = document.getElementById('emailSend');
//                             button.addEventListener('click', function () {
//                                 SaveEmailNotes(res);
//                                 $(document).ready(function () {
//                                     $("#emailResume").modal("hide");
//                                 })
//                             });
//                             button.href = "mailto:" + emailData;

//                         }
//                     });
//                     const label = document.createElement('label');
//                     label.className = "form-check-label";
//                     const b = document.createElement('b');
//                     b.innerHTML = `${item?.Jobfn} ${item?.Jobln} <br>`;
//                     const em = document.createElement('em');
//                     em.innerHTML = `[${item?.Jobln}]`;
//                     newData.append(div);
//                     div.append(input);
//                     div.append(label);
//                     label.append(b);
//                     label.append(em);
//                 })
//             }
//         })
// }

const openResume = () => {
    const api = apiUrl + "/User/GetProfileLastestResume";
    const data = {};
    data.UserId = userData?.UserID;
    data.Proser = userObj?.ProSer;
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    }
    fetch(api, requestOptions)
        .then(response => response?.json())
        .catch((error) => { console.log(error, "err"); })
        .then((response) => {
            if (response?.Success) {
                localStorage.setItem("resume", response?.Data);
            }
        })
}

const viewResume = () => {
    const resume = localStorage.getItem("resume");
    if (resume) {
        const iframe = document.getElementById("iframe");
        iframe.src = resume;
        $(document).ready(function () {
            $("#viewResume").modal("show");
        })
    } else {
        const error = document.getElementById("error-msg");
        error.innerHTML = "No Resume Found"
        $(document).ready(function () {
            $("#errorModal").modal("show");
        })
    }
}

const mailResume = () => {
    const oldUserList = document.querySelectorAll('#cont-div');
    for (let i = 0; i < oldUserList?.length; i++) {
        oldUserList[i].remove();
    }
    $(document).ready(function () {
        $("#emailResume").modal("show");
    })
    const api = apiUrl + "/User/GetJobUserList";
    const data = {};
    data.NoOfRow = 10;
    data.PageNumber = 1;
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    }
    showSpinner();
    fetch(api, requestOptions)
        .then(response => response?.json())
        .catch((error) => { console.log(error, "err"); })
        .then((response) => {
            hideSpinner();
            const users = response?.Data;
            openResume();
            if (users?.length > 0) {
                users.map(item => {
                    const newData = document.getElementById("userDiv");
                    const div = document.createElement('div');
                    div.id = "cont-div"
                    const input = document.createElement('input');
                    input.className = "form-check-input";
                    input.type = "radio";
                    input.name = "emailFeild"
                    input.id = item?.JobSer;
                    input.value = item?.JobEmail + "/" + item?.JobSer;
                    input.addEventListener('change', function (e) {
                        if (e?.target.checked === true && e?.target.value.split("/")[0] === 'null') {
                            const error = document.getElementById("error-msg-new");
                            error.innerHTML = "No valid email id exists for this user"
                            $(document).ready(function () {
                                $("#newErrorModal").modal("show");
                            })
                            input.checked = false;
                            return;
                        }
                    })
                    const button = document.getElementById('emailSend');
                    button.onclick = function () {
                        var radios = document.getElementsByName('emailFeild');
                        for (var radio of radios) {
                            if (radio.checked) {
                                let res = [];
                                res = users.find(el => el.JobSer === Number(radio.value.split("/")[1]));
                                $(document).ready(function () {
                                    $("#emailResume").modal("hide");
                                })
                                saveNotesClientEmail(res);
                                saveNotesUserEmail(res);
                                const ref = `mailto:${radio.value.split("/")[0]}?body=Open the link below in your browser to download/view attached resume for this applicant.%0D%0A%0D%0A`;
                                localStorage.setItem("mailto", ref);
                                const resume = localStorage.getItem("resume").replaceAll(':', '%3A');
                                button.href = localStorage.getItem("mailto") + resume;
                            }
                        }
                    }
                    const label = document.createElement('label');
                    label.className = "form-check-label";
                    const b = document.createElement('b');
                    b.innerHTML = `${item?.Jobfn} ${item?.Jobln} <br>`;
                    const em = document.createElement('em');
                    em.innerHTML = `[${item?.Jobln}]`;
                    newData.append(div);
                    div.append(label);
                    label.append(input);
                    label.append(b);
                    label.append(em);
                })
            }
        })
}

const saveNotesClientEmail = (item) => {
    const api = apiUrl + "/User/SaveNotes";
    const userid = JSON.parse(localStorage.getItem("logindata"))?.UserID
    const jobPos = item?.JobDetail
    const data = {};
    data.UserId = userid;
    data.JobSer = item?.JobSer;
    data.ProSer = item?.JobProSer;
    data.NoteType = "email";
    data.MessageText = `Sent resume of ${userObj?.Profn} ${userObj?.Proln} for ${jobPos} via mobile`;
    data.NoteDate = new Date();
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    }
    fetch(api, requestOptions)
        .then(response => response?.json())
        .catch((error) => { console.log(error, "err"); })
        .then((response) => { })
}

const saveNotesUserEmail = (item) => {
    const api = apiUrl + "/User/SaveNotes";
    const userid = JSON.parse(localStorage.getItem("logindata"))?.UserID;
    const jobPos = item?.JobDetail;
    const data = {};
    data.UserId = userid;
    data.JobSer = item?.JobSer;
    data.ProSer = userObj?.ProSer;
    data.NoteType = "email";
    data.MessageText = `Sent resume to ${item?.Jobfn} ${item?.Jobln} for ${jobPos} via mobile`;
    data.NoteDate = new Date();
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    }
    fetch(api, requestOptions)
        .then(response => response?.json())
        .catch((error) => { console.log(error, "err"); })
        .then((response) => { })
}


