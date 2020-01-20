<section id="rl-order-form" class="rl-order-form">
    <form action="/" class="rl-order-form__form" @submit.prevent="submitForm">
        <h1 class="rl-order-form__title">Application Form
            <!--br><span>No prepayment needed</span--></h1>

        <div class="rl-order-form__container">
            <div class="rl-order-form__row rl-order-form__row--line">
                <!-- courses -->
                <label class="rl-order-form__row-item">
          <span class="rl-order-form__label">
            <?php _e('Course type', 'ruslanguage-enroll-form'); ?>
          </span>
                    <select v-model="courseName" name="course" @change="changeCourse" id="courseSelect">
                        <option v-for="(course, key) in plans.courses" :key="key" :value="key">
                            {{ course.title }}
                        </option>
                    </select>
                </label>

                <!-- lessons per week -->
                <label class="rl-order-form__row-item">
          <span class="rl-order-form__label">
            <?php _e('Lessons per week', 'ruslanguage-enroll-form'); ?>
          </span>
                    <span class="rl-order-form__select">
            <select v-model="currentLessonModel" name="custom[individual]" @change="changeWeekLessons">
              <option v-for="(lesson, i) in currentLessons" :key="i" :value="generateLesson(i)">
                {{ getLessonSelectOption(lesson) }}
              </option>
            </select>
            <span ref="lessonInfo" class="rl-order-form__select-value"></span>
          </span>
                </label>
            </div>

            <div class="rl-order-form__row rl-order-form__row--line">
                <!-- start date -->
                <label class="rl-order-form__row-item label-required start-label">
          <span class="rl-order-form__label">
            <?php _e('Start date', 'ruslanguage-enroll-form'); ?>
          </span>
                    <div class="erorr-message error-message-top">This field is required</div>
                    <input ref="startDate" name="date_start"
                           v-model="startDay"
                           placeholder="<?php _e('Start date', 'ruslanguage-enroll-form'); ?>" readonly
                           class="rl-order-form__date-field" required />
                </label>

                <!-- number of weeks -->
                <div class="rl-order-form__row-item">
                    <div class="rl-order-form__label">
                        <?php _e('Number of weeks', 'ruslanguage-enroll-form'); ?>
                    </div>
                    <div class="rl-order-form__range-box">
                        <input ref="weeks" v-model.number="weeks" type="text" name="weeks" @input="changeWeeksInput"/>
                        <input type="range" :min="currentLesson.min" :max="currentLesson.max" v-model.number="weeks"
                               name=""/>
                    </div>
                </div>
            </div>

            <div class="rl-order-form__row rl-order-form__row--line">
                <!-- end date -->
                <label class="rl-order-form__row-item">
                    <!--          <span v-show="startDate">-->
                    <span>
            <span class="rl-order-form__label">
              <?php _e('End date', 'ruslanguage-enroll-form'); ?>
            </span>
                        <input type="hidden" name="form_type" value="order">
            <input
                          name="date_end"
                            placeholder="<?php _e('End Date', 'ruslanguage-enroll-form'); ?>"
                            readonly
                          v-model="getEndDate()"
                            class="rl-order-form__date-field"/>
                    </span>
                </label>
                <!-- Individual lessons -->
                <div class="rl-order-form__row-item">
                    <div v-show="showIndividualLessons">
            <span class="rl-order-form__label">
              <?php _e('Time options', 'ruslanguage-enroll-form'); ?>
            </span>
                        <span class="rl-order-form__select">
              <select model="individualLessonsIndex" name="segment" @change="changeIndividualLessons">
                <option v-for="(individual, key) in individualLessons" :key="key" :value="key">
                  {{ getIndividualSelectOption(individual) }}
                </option>
              </select>
              <span ref="individualLessonsInfo" class="rl-order-form__select-value"></span>
            </span>
                    </div>
                </div>
            </div>

            <!-- services -->
            <div class="rl-order-form__label js-Services">
                <?php _e('Additional services', 'ruslanguage-enroll-form'); ?>
            </div>
            <div class="rl-order-form__row rl-order-form__row--line services js-Services">
                <div v-for="(service, key, i) in plans.services" :key="key" class="rl-order-form__row-item"
                     v-if="courseName !== 'individual'">
                    <input :id="'services' + i" v-model="checkedServices" :name="'services['+key+']'" type="checkbox" :value="key"/>
                    <label :for="'services' + i" class="rl-order-form__checkbox">
                        {{ service.title }}
                        <span>
              {{ getServicePrice(key) }}€
              <span v-if="typeof service.price !== 'number'">for {{weeks}} weeks </span>
            </span>
                    </label>
                </div>
                <div v-for="(service, key, i) in plans.services" :key="key"
                     v-if="courseName === 'individual'"
                     class="rl-order-form__row-item"
                     @mouseover="onHoverVue(event)"
                     @mouseleave="inHoverVue(event)"
                >
                    <div class="overlay-hover">
                    <input :id="'services' + i"
                           :name="'services['+key+']'"
                           v-model="checkedServices" type="checkbox" :value="key"
                           :disabled="lessonIndex < 3"/>
                    <label :for="'services' + i" class="rl-order-form__checkbox">
                        {{ service.title }}
                        <span>
              {{ getServicePrice(key) }}€
              <span v-if="typeof service.price !== 'number'">for {{weeks}} weeks </span>
            </span>
                    </label>
                    </div>
                    <div class="overlay-onhover">
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0)">
                                <path d="M11.7162 19.8671C10.7172 16.6443 12.3351 13.1907 15.4509 11.8958C16.0451 11.6514 16.6714 11.4943 17.3104 11.4297H18.6015C19.1623 11.4835 19.7134 11.611 20.2409 11.8087C23.1075 12.8791 24.8471 15.796 24.4267 18.8269C24.0063 21.8581 21.5382 24.191 18.4883 24.4408C15.4383 24.6903 12.6239 22.7894 11.7162 19.8671Z" fill="white"/>
                                <path d="M20.246 7.39844V11.4354H18.6067C18.3967 11.415 18.1764 11.4047 17.9613 11.4047C17.741 11.4047 17.5258 11.415 17.3157 11.4354H15.4561V7.39844H20.246Z" fill="#E0E0E2"/>
                                <path d="M15.4506 7.39699H0.506837V3.37547C0.506437 3.13493 0.601892 2.904 0.77199 2.7339C0.942288 2.56381 1.17302 2.46835 1.41376 2.46875H3.12474V4.69723H6.28056V2.46875H14.4619V4.69723H17.6227V2.46875H19.3337C19.5744 2.46835 19.8053 2.56381 19.9754 2.7339C20.1455 2.904 20.241 3.13493 20.2406 3.37547V7.39198H15.4506V7.39699Z" fill="#EFEFEF"/>
                                <path d="M17.6226 2.46972V4.70341H14.4668V0.533203H17.6226V2.46972Z" fill="#EFEFEF"/>
                                <path d="M15.4506 11.8958C13.8395 12.5647 12.563 13.8507 11.9054 15.4664H10.3789V11.4297H15.4556V11.8958H15.4506Z" fill="#E0E0E2"/>
                                <path d="M10.3789 7.39844H15.4556V11.4354H10.3789V7.39844Z" fill="#D4E1F4"/>
                                <path d="M11.9054 15.4668C11.3367 16.8698 11.2696 18.4261 11.7159 19.8725H10.3789V15.472H11.9054V15.4668Z" fill="#D4E1F4"/>
                                <path d="M5.29688 15.4668H10.3738V19.8675H5.29688V15.4668Z" fill="#E0E0E2"/>
                                <path d="M5.29688 11.4297H10.3738V15.4664H5.29688V11.4297Z" fill="#D4E1F4"/>
                                <path d="M5.29688 7.39844H10.3738V11.4354H5.29688V7.39844Z" fill="#E0E0E2"/>
                                <path d="M6.2855 2.46972V4.70341H3.12988V0.533203H6.2855V2.46972Z" fill="#EFEFEF"/>
                                <path d="M5.2968 15.4668V19.8675H1.41376C1.17302 19.8679 0.942288 19.7725 0.77199 19.6024C0.601892 19.4323 0.506437 19.2013 0.506837 18.9608V15.4668H5.2968Z" fill="#D4E1F4"/>
                                <path d="M0.506836 11.4297H5.2968V15.4664H0.506836V11.4297Z" fill="#E0E0E2"/>
                                <path d="M0.506836 7.39844H5.2968V11.4354H0.506836V7.39844Z" fill="#D4E1F4"/>
                                <path d="M20.748 11.4652V3.37594C20.7518 2.59309 20.1222 1.95413 19.3392 1.94672H18.1353V0.532707C18.1353 0.250945 17.9099 0 17.623 0H14.4621C14.1716 0.00880507 13.938 0.24234 13.9292 0.532707V1.94672H6.81354V0.532707C6.80713 0.24314 6.5754 0.00920533 6.28583 0H3.12501C2.84325 0 2.61272 0.250945 2.61272 0.532707V1.94672H1.41403C0.629975 1.95373 -0.0013887 2.59209 1.21054e-05 3.37594V18.9601C-0.00318974 19.7448 0.629174 20.3841 1.41403 20.3893H11.3473C11.8186 21.6189 12.6537 22.7715 13.7347 23.581C14.9518 24.4945 16.4341 24.9856 17.956 24.9796C21.8392 24.9796 25 21.8186 25 17.9303C24.9992 15.1201 23.328 12.5792 20.748 11.4652ZM17.29 10.9119H15.9836V7.88934H19.7234V10.9119H18.6271C18.1829 10.8607 17.7342 10.8607 17.29 10.9119ZM14.959 7.88934V10.9119H10.9119V7.88934H14.959ZM9.88731 10.9119H5.78895V7.88934H9.88731V10.9119ZM4.76436 10.9119H1.0246V7.88934H4.76436V10.9119ZM4.76436 11.9365V14.959H1.0246V11.9365H4.76436ZM5.78895 11.9365H9.88731V14.959H5.78895V11.9365ZM9.88731 15.9836V19.3648H5.78895V15.9836H9.88731ZM10.9119 15.9836H11.1885C11.0027 16.6192 10.9097 17.2784 10.9119 17.9405C10.9129 18.4188 10.9609 18.8959 11.0554 19.3648H10.9119V15.9836ZM10.9119 14.959V11.9365H14.247C13.0843 12.6683 12.1548 13.7169 11.5677 14.959H10.9119ZM14.959 1.02459H17.1107V4.20082H14.959V1.02459ZM3.63731 1.02459H5.78895V4.20082H3.63731V1.02459ZM1.41403 2.97131H2.61272V4.70291C2.61272 4.98747 2.84045 5.21981 3.12501 5.22541H6.28583C6.5734 5.22101 6.80633 4.99047 6.81354 4.70291V2.97131H13.9344V4.70291C13.944 4.99127 14.1786 5.22141 14.4671 5.22541H17.623C17.9075 5.21981 18.1353 4.98747 18.1353 4.70291V2.97131H19.3392C19.5569 2.97711 19.729 3.15822 19.7234 3.37594V6.86475H1.0246V3.37594C1.0234 3.15802 1.1959 2.97852 1.41403 2.97131ZM1.0246 18.9601V15.9836H4.76436V19.3648H1.41403C1.1951 19.3594 1.0216 19.1788 1.0246 18.9601ZM17.956 23.955C16.6554 23.958 15.3893 23.5372 14.3495 22.7561C13.3325 21.9941 12.5815 20.9313 12.2028 19.7182C11.794 18.3854 11.8574 16.9524 12.3821 15.6608C12.9929 14.1736 14.1682 12.9891 15.6506 12.3667C16.1885 12.137 16.7589 11.9917 17.3412 11.9365H18.5759C21.6451 12.2543 23.9782 14.8395 23.9806 17.9251C23.9806 21.25 21.2807 23.955 17.956 23.955Z" fill="#163770"/>
                                <path d="M20.4643 17.4643H18.6429C18.5837 17.4643 18.5357 17.4163 18.5357 17.3571V15.5357C18.5357 15.2399 18.2958 15 18 15C17.7042 15 17.4643 15.2399 17.4643 15.5357V17.3571C17.4643 17.4163 17.4163 17.4643 17.3571 17.4643H15.5357C15.2399 17.4643 15 17.7042 15 18C15 18.2958 15.2399 18.5357 15.5357 18.5357H17.3571C17.4163 18.5357 17.4643 18.5837 17.4643 18.6429V20.4643C17.4643 20.7601 17.7042 21 18 21C18.2958 21 18.5357 20.7601 18.5357 20.4643V18.6429C18.5357 18.5837 18.5837 18.5357 18.6429 18.5357H20.4643C20.7601 18.5357 21 18.2958 21 18C21 17.7042 20.7601 17.4643 20.4643 17.4643Z" fill="#163770"/>
                            </g>
                            <defs>
                                <clipPath id="clip0">
                                    <rect width="25" height="25" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                         <span>Available from
20 ac.hrs/week</span>
                    </div>
                </div>
            </div>

            <div class="rl-order-form__total">
                <span class="frame">Total: <i>{{ total }}€ </i></span>
                <input name="total" type="hidden" v-model="total">
            </div>

            <!-- <div class="rl-order-form__options">
              <div class="rl-order-form__label">
              <?php _e('Options', 'ruslanguage-enroll-form'); ?>:
              </div>
              <ul class="rl-order-form__options-list">
                <li v-for="i in 2" :key="i" class="rl-order-form__options-item">
                  <span>Private tuition</span>
                  <b>{{ total }}€</b>
                </li>
              </ul>
            </div> -->

            <div class="rl-order-form__contacts">
                <div class="rl-order-form__row rl-order-form__row--line">
                    <div class="rl-order-form__row-item">
                        <label class="rl-order-form__row label-required">
                            <div class="erorr-message">This field is required</div>
                            <input ref="personal_name" name="personal[name]" placeholder="<?php _e('Name', 'ruslanguage-enroll-form'); ?>" required/>
                        </label>
                        <label class="rl-order-form__row label-required">
                            <div class="erorr-message">This field is required</div>
                            <input ref="personal_email" name="personal[email]" type="email"
                                   placeholder="<?php _e('Email', 'ruslanguage-enroll-form'); ?>" required/>
                        </label>
                        <label class="rl-order-form__row label-required">
                            <div class="erorr-message">This field is required</div>
                            <input ref="personal_citizenship" name="personal[citizenship]"
                                   placeholder="<?php _e('Citizenship', 'ruslanguage-enroll-form'); ?>" required/>
                        </label>
                        <label class="rl-order-form__row">
                            <select  ref="personal_level"  name="personal[level]" onchange="this.style.color = '#242424';">
                                <option value="" selected disabled><?php _e('Language level', 'ruslanguage-enroll-form'); ?></option>
                                <option v-for="level in plans.levels" :key="level" :value="level">
                                    {{ level }}
                                </option>
                            </select>
                        </label>
                    </div>

                    <div class="rl-order-form__row-item">
                        <label class="rl-order-form__row">
                            <input ref="birthDate" name="personal[birth]"
                                   placeholder="<?php _e('Date of birth', 'ruslanguage-enroll-form'); ?>"
                                   class="rl-order-form__date-field"/>
                        </label>

                        <label class="rl-order-form__row">
                            <input ref="personal_phone"  name="personal[phone]"
                                   placeholder="<?php _e('Phone', 'ruslanguage-enroll-form'); ?>"/>
                        </label>

                        <label class="rl-order-form__row">
                            <textarea ref="personal_comments"  name="personal[comments]"
                                      placeholder="<?php _e('Comments', 'ruslanguage-enroll-form'); ?>"></textarea>
                        </label>
                    </div>
                </div>
            </div>

            <div class="rl-order-form__actions">
                <button type="submit" class="rl-order-form__btn">
                    <?php _e('Enroll', 'ruslanguage-enroll-form'); ?>
                </button>
            </div>
        </div>
        <div class="ajax-modal">
            <div class="ajax-modal__content ajax-modal__content__success">
                <svg width="126" height="126" viewBox="0 0 126 126" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M45.6455 65.0608L58.589 78.0043L80.1615 47.8027" stroke="#28B446" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="62.9031" cy="62.9031" r="59.4031" stroke="#28B446" stroke-width="7"/>
                </svg>
                <div class="ajax-modal__title"><span>We have received your application request. </span></div>
                <div class="ajax-modal__subtitle"><span>
                  Our team will contact you very soon. If you do not receive our reply within 24 hours, <span class="red">please make sure</span> you have checked the spam folder and contact us. Thank you!
              </span></div>
                <div class="ajax-modal__btn">
                    <a href="JavaScript:void(0);">
                        <span>Close</span>
                    </a>
                </div>
            </div>
            <div  class="ajax-modal__content ajax-modal__content__pending">
                <svg width="125" height="125" viewBox="0 0 125 125" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M123.419 68.553C121.521 66.6362 118.43 66.6211 116.513 68.5186L105.3 79.6204V61.7344C105.3 47.6484 99.8148 34.4058 89.8546 24.4456C79.8944 14.4854 66.6514 9 52.5657 9C43.9163 9 35.3826 11.1291 27.7957 15.1692C27.7855 15.1746 27.7752 15.1799 27.765 15.1853C27.7435 15.1968 27.722 15.2083 27.7005 15.22L27.6956 15.2224C27.6478 15.248 27.5999 15.2737 27.5523 15.2996C27.5291 15.312 27.5059 15.3247 27.4827 15.3372C27.4659 15.3462 27.449 15.3555 27.4322 15.3645C27.1478 15.5188 26.8646 15.6758 26.5828 15.8357C26.564 15.8462 26.5455 15.8569 26.5269 15.8679C25.3785 16.5215 24.2496 17.2207 23.1573 17.9558C20.92 19.4614 20.3267 22.4958 21.8323 24.7329C22.7752 26.134 24.3172 26.8901 25.8878 26.8901C26.8253 26.8901 27.7733 26.6206 28.6092 26.0579C29.8145 25.2468 31.0743 24.4893 32.3536 23.8059C38.5389 20.5054 45.503 18.7656 52.5657 18.7656C76.2589 18.7656 95.5345 38.0413 95.5345 61.7344V79.7358L84.297 68.7654C82.3673 66.8813 79.2757 66.9189 77.3922 68.8486C75.5084 70.7781 75.5457 73.8696 77.4754 75.7534L90.1016 88.0793C92.9393 90.8494 96.6536 92.2324 100.368 92.2324C104.117 92.2324 107.866 90.823 110.71 88.0068L123.384 75.4583C125.3 73.5605 125.316 70.469 123.419 68.553Z" fill="#00A3DA"/>
                    <path d="M5.26489 54.7007C2.56714 54.5354 0.259033 56.5887 0.0966797 59.2806C0.0327148 60.3453 0 61.4285 0 62.5025C0.000244141 63.2183 0.0148926 63.941 0.0432129 64.6502C0.148926 67.2781 2.31226 69.3372 4.91895 69.3372C4.98486 69.3372 5.05103 69.336 5.11792 69.3333C7.81226 69.2251 9.90918 66.9532 9.80127 64.2586C9.77783 63.678 9.76587 63.0857 9.76563 62.5005C9.76563 61.6238 9.79224 60.7383 9.84473 59.8689C10.0071 57.1773 7.95679 54.8633 5.26489 54.7007Z" fill="#00A3DA"/>
                    <path d="M16.112 84.9872C15.3478 83.7462 14.6408 82.4537 14.0097 81.1456C12.8383 78.7169 9.91986 77.6969 7.49067 78.869C5.06171 80.0404 4.04243 82.9591 5.21406 85.3881C5.9892 86.9952 6.85761 88.5826 7.79535 90.1061C8.71772 91.6049 10.3188 92.4303 11.9582 92.4303C12.8312 92.4303 13.715 92.1962 14.5131 91.7049C16.8098 90.2914 17.5256 87.2838 16.112 84.9872Z" fill="#00A3DA"/>
                    <path d="M52.7344 105.468C51.2729 105.468 49.7991 105.394 48.354 105.248C45.6743 104.975 43.2761 106.932 43.0051 109.615C42.7339 112.298 44.689 114.693 47.3723 114.964C49.1423 115.143 50.9465 115.234 52.7346 115.234H52.7356C55.4324 115.234 57.6179 113.048 57.6179 110.351C57.6179 107.654 55.4311 105.468 52.7344 105.468Z" fill="#00A3DA"/>
                    <path d="M31.7589 100.011C30.4896 99.2998 29.2416 98.5139 28.0502 97.6762C25.8439 96.125 22.7985 96.6557 21.2475 98.8618C19.6962 101.068 20.2272 104.113 22.433 105.665C23.8949 106.693 25.4262 107.656 26.984 108.53C27.7394 108.953 28.5585 109.154 29.3671 109.154C31.0763 109.154 32.7357 108.255 33.631 106.658C34.9491 104.306 34.1115 101.33 31.7589 100.011Z" fill="#00A3DA"/>
                    <path d="M15.1197 32.5184C12.8528 31.0587 9.83083 31.7122 8.37063 33.9796C7.40139 35.4842 6.50027 37.054 5.69217 38.6451C4.47073 41.0497 5.42996 43.9886 7.83401 45.2098C8.54251 45.5699 9.29763 45.7403 10.0415 45.7403C11.8213 45.7403 13.5374 44.7635 14.3987 43.068C15.0569 41.7721 15.791 40.4935 16.5808 39.2674C18.0408 37.0001 17.3867 33.9786 15.1197 32.5184Z" fill="#00A3DA"/>
                </svg>
                <div class="ajax-modal__title"><span>Sending application</span></div>
                <div class="ajax-modal__subtitle"><span>Preparing your application request...</span></div>
            </div>
        </div>
    </form>
</section>
