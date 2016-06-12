var EnterToken = Vue.extend({
    data: function () {
        return {
            'appState': appState,
            'errorMsg': '',
            'cta': 'Submit',
            'working': false,
        };
    },
    template: `
        <div>
            <p>An access token has been sent to @{{ appState.username }} on Slack, please enter it here:</p>
            <form v-on:submit.prevent="enterToken">
                <p v-if="errorMsg">{{ errorMsg }}</p>
                <input id='tokenInput' v-model="appState.token">
                <button action='submit' :disabled="working">{{ cta }}</button>
            </form>
            <a v-link="{ path: '/' }">Try again</a>
        </div>`,
    methods: {
        enterToken: function() {
            if (this.appState.token) {
                this.working = true;
                this.cta = 'Loading...';
                Vue.http.headers.common['X-Authorization'] = 'Bearer ' + this.appState.token;
                this.errorMsg = 'Authorization has been set, checking...';
                this.$http.get('/api/status')
                    .then(
                        function(result) {
                            if (result.data.logged_in && result.data.logged_in === this.appState.username) {
                                this.appState.logged_in = true;
                                router.go('/dashboard');
                            } else {
                                this.working = false;
                                this.cta = 'Submit';
                                this.errorMsg = 'Could not verify this token!';
                                document.getElementById('tokenInput').focus();
                            }
                        }
                    );
            } else {
                document.getElementById('tokenInput').focus();
            }
        }
    }
})

