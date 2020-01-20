(function () {
    var json_url = '/wp-content/mu-plugins/rl-order-form/data/rlof_plans.json';

    var vm = new Vue({
        el: '#rl-order-form',

        data: function () {
            let paramsFromUrl = this.parseUrlParams();
            console.log(paramsFromUrl);
            return {
                plans: {
                    services: {},
                    courses: {
                        intensive: {
                            title: '',
                        },
                    },
                },
                courseName: paramsFromUrl.course || 'intensive',
                // current course
                course: {
                    lessons: [
                        {
                            title: '',
                            min: 1,
                            max: 1,
                            price: 0,
                        },
                    ],
                },
                lessonIndex: 0,
                individualLessonsIndex: 0,
                weeks: paramsFromUrl.span || 1,
                checkedServices: [],
                showIndividualLessons: false,
                startDate: null,
                startDay: null,
                placeHolderStart: null,
                endDate: null,
                holidays: null,
                hover0: false,
                hover1: false,
                hover2: false,
                urlParams: paramsFromUrl,
                days: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            };
        },

        computed: {
            currentLessonModel: {
                get: function () {
                    return JSON.stringify({
                        name: this.courseName,
                        index: this.lessonIndex,
                    });
                },
                set: function () {
                    return JSON.stringify({
                        name: this.courseName,
                        index: this.lessonIndex,
                    });
                },
            },

            currentLessons: function () {
                return this.course.lessons;
            },

            currentLesson: function () {
                return this.currentLessons[this.lessonIndex];
            },

            total: function () {
                if (this.courseName !== 'individual') {
                    var services = this.checkedServices.reduce((acc, service) => {
                        return acc + this.getServicePrice(service);
                    }, 0);
                } else {
                    if (this.lessonIndex < 3) {
                        var services = 0;

                    } else {
                        var services = this.checkedServices.reduce((acc, service) => {
                            return acc + this.getServicePrice(service);
                        }, 0);
                    }
                }
                var lessonsPrice = this.getLessonPrice(this.lessonIndex) * this.weeks;
                var indidvidualLessonsPrice = this.getIndividualLessonsPrice(this.individualLessonsIndex) * this.weeks;
                return lessonsPrice + services + indidvidualLessonsPrice;

            },

            individualLessons: function () {
                if (!this.course.individual) {
                    this.showIndividualLessons = false;
                    return [];
                }

                var lessons = this.course.individual.times;

                this.showIndividualLessons = true;

                // if (lessons[0].price > 0) {
                //   lessons.unshift({
                //     title: this.course.individual.title,
                //     price: 0,
                //   });
                // }

                return lessons;
            },
        },

        watch: {
            courseName: function () {
                this.course = this.plans.courses[this.courseName];
                this.lessonIndex = 0;
                this.individualLessonsIndex = 0;
                this.checkedServices = [];
                var v = jQuery('#courseSelect').val();
                if (v == 'intensive' || v == 'intensiveToefl' || v == 'individual') {

                    jQuery('.js-Services').show();

                } else {
                    this.checkedServices = [];
                    jQuery('.js-Services').hide();
                }

                this.updateSelectWeekLessonsInfo();
                this.checkIndividualLessons();
                this.resetCalendars();
            },

            weeks: function () {
                this.updateSelectWeekLessonsInfo();
                if (this.startDay) {
                    this.updateCalendars();
                }
            },

            lessonIndex: function () {
                this.updateSelectWeekLessonsInfo();
            },

            individualLessonsIndex: function () {
                this.updateIndividualLessons();
            },

            showIndividualLessons: function () {
                this.updateIndividualLessons();
            },

            startDate: function () {
                if (this.startDate) {
                    this.updateCalendars();
                }
            },
        },

        created: function () {
            jQuery.getJSON(json_url, function (data) {
                vm.plans = data;
                if (vm.urlParams && vm.urlParams.course) {
                    vm.courseName = vm.urlParams.course;
                    vm.course = data.courses[vm.courseName];
                } else {
                    vm.courseName = Object.keys(data.courses)[0];
                    vm.course = data.courses[vm.courseName];
                }
                vm.holidays = data.holidays;

                vm.checkIndividualLessons();
                vm.updateSelectWeekLessonsInfo();
                vm.updateCalendars();
                vm.fillFormFromUrlParams();

                vm.$el.querySelector('form').setAttribute('novalidate', 'novalidate');
            }).done(function () {
                //this.submitForm();
            })
        },

        mounted: function () {
            this.$el.classList.add('is-visible');


        },

        methods: {
            onHoverVue(event) {
                if (this.lessonIndex < 3) {
                    event.target.classList.add('on-hover')
                }
            },
            inHoverVue(event) {
                if (this.lessonIndex < 3) {
                    if (event.target.classList.contains('on-hover')) {
                        event.target.classList.remove('on-hover')
                    }
                }
            },
            fillFormFromUrlParams: function () {

                let params = this.urlParams;

                if (!params.form_hide) {
                    return {};
                }


                if (params.date_start && params.date_start !== '') {
                    let newStart = params.date_start.split('/')[2] + '/' + params.date_start.split('/')[1] + '/' + params.date_start.split('/')[0];
                    this.startDate = newStart;
                    this.$refs.startDate.value = newStart;
                    //jQuery(this.$refs.startDate).attr('value',newStart);
                }

                if (params.course && params.course !== '') {
                    //this.course = this.plans.courses[params.course]
                    //this.courseName = params.course;

                    //this.course = this.plans.courses[this.courseName];

                    //console.log(this.courseName);
                }

                if (params.visa && params.visa == 'true') {
                    this.checkedServices.push('visa_support');
                }
                if (params.accommodation && params.accommodation == 'true') {
                    this.checkedServices.push('accommodation');
                }
                if (params.transport && params.transport == 'true') {
                    this.checkedServices.push('airport_transfer_from');
                }

                this.submitForm();

            },
            parseUrlParams: function () {
                var match,
                    pl = /\+/g,  // Regex for replacing addition symbol with a space
                    search = /([^&=]+)=?([^&]*)/g,
                    decode = function (s) {
                        return decodeURIComponent(s.replace(pl, " "));
                    },
                    query = window.location.search.substring(1);

                let urlParams = {};
                while (match = search.exec(query))
                    urlParams[decode(match[1])] = decode(match[2]);
                console.log('URL Parameters', urlParams);

                return urlParams;
            },

            changeCourse: function (event) {
                var name = event.currentTarget.value;
                this.courseName = name;
            },

            // lessons per week
            generateLesson: function (index) {
                return JSON.stringify({name: this.courseName, index});
            },

            changeWeekLessons: function (event) {
                var lessonData = JSON.parse(event.currentTarget.value);
                this.lessonIndex = lessonData.index;
                // this.weeks = this.currentLesson.min;
            },

            updateSelectWeekLessonsInfo: function () {
                var title = this.currentLesson.title;
                var price = this.getLessonPrice(this.lessonIndex);

                var titleHtml = '<span class="rl-order-form__select-name">' + title + '</span>';
                var priceHtml = price > 0 ? '<span class="rl-order-form__select-price">' + price + '€/week</span>' : '';

                this.$refs.lessonInfo.innerHTML = titleHtml + priceHtml;
            },

            getLessonSelectOption: function (data) {
                var title = data.title;
                var price = data.price > 0 ? ' ' + data.price + '€' : '';

                return title + price;
            },

            // weeks
            changeWeeksInput: function (event) {
                var min = this.currentLesson.min;
                var max = this.currentLesson.max;
                var value = event.currentTarget.value;

                value = value < min ? min : value;
                value = value > max ? max : value;

                this.weeks = value;
            },

            // individual lessons
            checkIndividualLessons: function () {
                this.showIndividualLessons = !!this.course.individual;
            },

            changeIndividualLessons: function (event) {
                var index = event.currentTarget.value;
                this.individualLessonsIndex = index;
            },

            updateIndividualLessons: function () {
                if (!this.showIndividualLessons) return;

                var title = this.individualLessons[this.individualLessonsIndex].title;
                var price = this.individualLessons[this.individualLessonsIndex].price;
                var titleHtml = '<span class="rl-order-form__select-name">' + title + '</span>';
                var priceHtml = price > 0 ? '<span class="rl-order-form__select-price">' + price + '€/ac. hour</span>' : '';

                this.$refs.individualLessonsInfo.innerHTML = titleHtml + priceHtml;
            },

            getIndividualSelectOption: function (data) {
                var title = data.title;
                var price = data.price > 0 ? ' ' + data.price + '€/ac. hour' : '';

                return title + price;
            },

            // price
            getServicePrice: function (key) {
                var isObject = typeof this.plans.services[key].price === 'object';
                var weeks = isObject ? this.weeks : 1;

                return this.getPrice(this.plans.services, key) * weeks;
            },

            getIndividualLessonsPrice: function (key) {
                var price = 0;
                var quantity = 1;

                if (this.individualLessons[key]) {
                    quantity = this.currentLesson.quantity || 1;
                    price = this.individualLessons[key].price * quantity;
                }

                return price;
            },

            getLessonPrice: function (key) {
                return this.getPrice(this.course.lessons, key);
            },

            getPrice: function (asset, key) {
                var asset = asset[key];
                var isObject = typeof asset.price === 'object';
                var weeks = this.weeks;
                var price = 0;

                if (isObject) {
                    Object.keys(asset.price).map(function (objectKey) {
                        var minWeek = Number(objectKey);
                        var minPrice = asset.price[objectKey];

                        if (minWeek <= weeks) {
                            price = minPrice;
                        }
                    });

                    return price;
                }

                return isNaN(asset.price) ? 0 : asset.price;
            },

            // dates
            updateCalendars() {
                var $vm = this;
                var startDateOptions = {
                    format: 'dd/mm/yyyy',
                    startDate: null,
                    weekStart: 1,
                    defaultDate: null,
                    defaultValue: null,
                    filter: this.filterCourseStartDates,
                    autoHide: true,
                };

                var endDateOptions = {
                    format: 'dd/mm/yyyy',
                    startDate: new Date($vm.startDay),
                    date: this.getEndDate(),
                    defaultDate: null,
                    weekStart: 1,
                    filter: this.filterCourseEndDates,
                    autoHide: true,
                };

                var date2Options = {
                    format: 'dd/mm/yyyy',
                    endDate: Date.now(),
                    weekStart: 1,
                    autoHide: true,
                };

                // start date
                jQuery(this.$refs.startDate)
                    .datepicker('destroy')
                    .datepicker(startDateOptions)
                    .datepicker('pick')
                    .on('change', function (event) {

                        var today = jQuery($vm.$refs.startDate).datepicker('getDate');
                        var dd = today.getDate();
                        var mm = today.getMonth() + 1;
                        var yyyy = today.getFullYear();
                        if (dd < 10) {
                            dd = '0' + dd;
                        }
                        if (mm < 10) {
                            mm = '0' + mm;
                        }
                        var today = dd + '/' + mm + '/' + yyyy;
                        $vm.startDay = today;
                        $vm.endDate = $vm.getEndDate();
                        $vm.updateEndDate();
                        vm.$refs.startDate.closest('.label-required').className = 'rl-order-form__row-item label-required start-label';
                        $vm.$refs.startDate.className = 'rl-order-form__date-field';
                    })

                // end date
                jQuery(this.$refs.endDate)
                    .datepicker('destroy')
                    .datepicker(endDateOptions)
                    .datepicker('pick')
                    .on('change', function (event) {
                        return false;
                        //$vm.endDate = jQuery($vm.$refs.endDate).datepicker('getDate');

                        var today = jQuery($vm.$refs.endDate).datepicker('getDate');
                        var dd = today.getDate();
                        var mm = today.getMonth() + 1;
                        var yyyy = today.getFullYear();
                        if (dd < 10) {
                            dd = '0' + dd;
                        }
                        if (mm < 10) {
                            mm = '0' + mm;
                        }
                        $vm.endDate = dd + '/' + mm + '/' + yyyy;

                        var t = $vm.startDay.split('/');
                        var start = new Date(t[2], t[1], t[0]);

                        var t1 = $vm.endDate.split('/');
                        var end = new Date(t1[2], t1[1], t1[0]);

                        var weeks = $vm.getCeilWeeks(start, end) || 1;

                        if (weeks < $vm.currentLesson.min) {
                            weeks = $vm.currentLesson.min;
                        }

                        if (weeks > $vm.currentLesson.max) {
                            weeks = $vm.currentLesson.max;
                        }

                        //$vm.weeks = weeks;
                        jQuery($vm.$refs.weeks).val(weeks);


                    });
                // birth date
                jQuery(this.$refs.birthDate)
                    .datepicker('destroy')
                    .datepicker(date2Options);
            },

            filterCourseStartDates(date, view) {
                if (this.checkHolidayDate(date)) return false;
                var day = date.getDay();
                var startDays = (this.course.days && this.course.days.start) || [1, 2, 3, 4, 5, 6, 0];

                if (startDays.indexOf(day) < 0 && view === 'day') {
                    return false;
                }

                return true;
            },

            filterCourseEndDates(date, view) {
                if (this.checkHolidayDate(date)) return false;

                var day = date.getDay();
                var endDays = (this.course.days && this.course.days.end) || [1, 2, 3, 4, 5, 6, 0];

                if (view === 'day' && (endDays.indexOf(day) < 0 || date < this.startDate)) {
                    return false;
                }

                return true;
            },

            checkHolidayDate(date) {
                var $vm = this;
                var isHoliday = false;

                if (Array.isArray($vm.holidays)) {
                    $vm.holidays.forEach(function (item) {
                        var startHolidayDate = new Date(item.start);
                        var endHolidayDate = new Date(item.end);

                        (isHoliday = date > startHolidayDate && date < endHolidayDate), date;

                        if (isHoliday) return false;
                    });
                }

                return isHoliday;
            },
            getEndDate() {
                if (this.startDay === null) return;
                Date.prototype.addDays = function (days) {
                    var date = new Date(this.valueOf());
                    date.setDate(date.getDate() + days);
                    return date;
                }

                let delta = 0;
                if (this.course.days.end) {
                    delta = this.course.days.end[0];
                }

                var startTmp = new Date(this.startDay.split('/')[2], this.startDay.split('/')[1] - 1, this.startDay.split('/')[0]);
                startTmp.setDate(startTmp.getDate() - startTmp.getDay() + (this.weeks - 1) * 7 + delta);


                var dd = startTmp.getDate();
                var mm = startTmp.getMonth() + 1;
                var yyyy = startTmp.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                return dd + '/' + mm + '/' + yyyy;


            },
            updateEndDate() {
                if (this.endDate === null) return;

                let delta = 0;
                if (this.course.days.end) {
                    delta = this.course.days.end[0];
                }

                var startTmp = new Date(this.startDay.split('/')[2], this.startDay.split('/')[1] - 1, this.startDay.split('/')[0]);

                startTmp.setDate(startTmp.getDate() - startTmp.getDay() + (this.weeks - 1) * 7 + delta);


                var dd = startTmp.getDate();
                var mm = startTmp.getMonth() + 1;
                var yyyy = startTmp.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                this.endDate = dd + '/' + mm + '/' + yyyy;
                jQuery(this.$refs.endDate).attr('value', dd + '/' + mm + '/' + yyyy);


            },

            getHolidayWeeks() {
                var $vm = this;
                var weeks = 0;

                if (Array.isArray($vm.holidays)) {
                    $vm.holidays.forEach(function (item, i) {
                        var startHolidayDate = new Date(item.start);
                        var endHolidayDate = new Date(item.end);

                        if (startHolidayDate < $vm.startDate) {
                            startHolidayDate = $vm.startDate;
                        }

                        if (endHolidayDate > $vm.endDate) {
                            endHolidayDate = $vm.endDate;
                        }

                        weeks += $vm.getCeilWeeks(startHolidayDate, endHolidayDate);
                    });
                }

                return weeks;
            },

            getCeilWeeks: function (startDate, endDate) {
                var isValid = this.isValidDate(startDate) && this.isValidDate(endDate);
                var weeks = 0;

                if (isValid) {
                    weeks = Math.ceil((endDate - startDate) / 1000 / 60 / 60 / 24 / 7);
                }

                return weeks;
            },

            isValidDate: function (date) {
                return date instanceof Date && !isNaN(date);
            },

            resetCalendars: function () {
                this.startDay = null;
                this.$refs.startDate.value = '';
                this.updateCalendars();
            },

            // form
            submitForm(event) {
                var $form = event.currentTarget;
                // var $form = jQuery('#rl-order-form__form');
                var formData = jQuery('.rl-order-form__form').serialize();
                if (this.checkFormRequired($form)) {
                    console.log($form)
                    // formData.push({name: "end-date",value:this.getEndDate()});
                    // console.log(JSON.stringify(formData));
                    jQuery(".ajax-modal").css('display', 'flex');
                    jQuery(".ajax-modal__content__success").hide();
                    jQuery(".ajax-modal__content__pending").show();
                    var ajaxStatus = jQuery.ajax({
                        type: 'POST',
                        //url: '/wp-admin/admin-ajax.php?action=enroll_form&'+formData,
                        url: '/wp-admin/admin-ajax.php?action=enroll_form_new&' + formData,
                        //data: '',
                        processData: false,
                        contentType: false,
                        dataType: 'json',
                        success: function (response) {
                            jQuery(".ajax-modal__content__success").show();
                            jQuery(".ajax-modal__content__pending").hide();
                        },
                        error: function (err) {
                            console.log('RL order form:', err);
                        },
                    });
                }
            },

            checkFormRequired($form) {
                var $requiredFields = jQuery($form).find(':required');
                var isValid = true;
                // if($requiredFields[0].value === today){
                //     $requiredFields[0].classList.add('is-error');
                //     console.log($requiredFields[0]);
                // }
                $requiredFields.each(function (i, field) {
                    var fieldValid = field.value.length > 2;
                    var emailValid = true;
                    if (field.type === 'email') {
                        emailValid = /@/.test(field.value);
                    }

                    if (fieldValid && emailValid) {
                        field.classList.remove('is-error');
                        field.closest('.label-required').classList.remove('is-error');
                    } else {
                        isValid = false;
                        field.classList.add('is-error');
                        field.closest('.label-required').classList.add('is-error');
                        jQuery(field).one('keyup', function () {
                            field.closest('.label-required').classList.remove('is-error');
                            field.classList.remove('is-error');
                        });
                    }
                });

                return isValid;
            },
        },
    });
    if (document.querySelector('.ajax-modal__btn') !== null) {
        document.querySelector('.ajax-modal__btn').onclick = () => {
            document.querySelector('.ajax-modal').style.display = 'none';
        }
    }
})();
