const SUPABASE_URL = "https://aqyaribzuyonficpokky.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_PqmX9mPWb5SIyRFptNKA0w_ykiDSrns";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

console.log("Supabase connected:", !!supabaseClient);