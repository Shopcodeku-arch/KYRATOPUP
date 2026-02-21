const supabaseUrl='https://tynclkichqdswtofnvfi.supabase.co';const supabaseKey='sb_publishable_sH-Nodx2cIbQJADwbN4NRg_4lWe_cEm';const{createClient}=window.supabase;const supabaseClient=createClient(supabaseUrl,supabaseKey);document.addEventListener('DOMContentLoaded',async()=>{const{data:{session}}=await supabaseClient.auth.getSession();if(!session){showLoginWarning()}else{const user=session.user;updateNavbarProfile(user);fetchUserTransactions(user.id)}
document.getElementById('btnLoginDiscord').addEventListener('click',loginDiscord)});async function loginDiscord(){const{error}=await supabaseClient.auth.signInWithOAuth({provider:'discord',options:{redirectTo:window.location.href}});if(error)console.error('Login error:',error);}
function showLoginWarning(){document.getElementById('loading-skeleton').style.display='none';document.getElementById('loginWarningModal').style.display='flex'}
function updateNavbarProfile(user){const userArea=document.getElementById('user-area');const avatarUrl=user.user_metadata.avatar_url;userArea.innerHTML=`<div class="profile-pic" style="background-image: url('${avatarUrl}'); border: 2px solid #f1c40f;"></div>`}
async function fetchUserTransactions(userId){const loadingSkeleton=document.getElementById('loading-skeleton');const trxList=document.getElementById('transaction-list');const emptyState=document.getElementById('empty-state');const{data,error}=await supabaseClient.from('transactions').select('*').eq('user_id',userId).order('created_at',{ascending:!1});loadingSkeleton.style.display='none';if(error){console.error("Error:",error);return}
if(!data||data.length===0){emptyState.style.display='block'}else{trxList.style.display='flex';renderTransactions(data,trxList)}}
function renderTransactions(transactions,container){container.innerHTML=transactions.map(trx=>{let statusClass='status-pending';if(trx.status==='success')statusClass='status-success';if(trx.status==='failed')statusClass='status-failed';const dateObj=new Date(trx.created_at);const dateStr=dateObj.toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'});const timeStr=dateObj.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});const price=new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',minimumFractionDigits:0}).format(trx.amount);const trxData=JSON.stringify(trx).replace(/"/g,'&quot;');return `
            <div class="trx-card" onclick="showReceipt(${trxData})">
                <div class="trx-left">
                    <div class="trx-game">
                        ${trx.game_name || 'TopUp Game'}
                    </div>
                    <div class="trx-item">${trx.item_name}</div>
                    <div class="trx-date">${dateStr} • ${timeStr}</div>
                </div>
                <div class="trx-right">
                    <div class="trx-price">${price}</div>
                    <div class="status-badge ${statusClass}">${trx.status}</div>
                </div>
                <button class="btn-delete-card" onclick="event.stopPropagation(); confirmDelete('${trx.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `}).join('')}
let transactionIdToDelete=null;function confirmDelete(id){transactionIdToDelete=id;document.getElementById('deleteConfirmModal').style.display='flex'}
function closeDeleteModal(){document.getElementById('deleteConfirmModal').style.display='none';transactionIdToDelete=null}
document.getElementById('btnConfirmDelete').addEventListener('click',async()=>{if(transactionIdToDelete){const{error}=await supabaseClient.from('transactions').delete().eq('id',transactionIdToDelete);if(error){alert('Gagal menghapus transaksi.')}else{window.location.reload()}
closeDeleteModal()}});function showReceipt(trx){const modal=document.getElementById('receiptModal');const dateObj=new Date(trx.created_at);const dateStr=dateObj.toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});const timeStr=dateObj.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})+" WIB";const price=new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',minimumFractionDigits:0}).format(trx.amount);document.getElementById('struk-id').innerText=`#TRX-${trx.id}`;document.getElementById('struk-date').innerText=dateStr;document.getElementById('struk-time').innerText=timeStr;document.getElementById('struk-status').innerText=trx.status.toUpperCase();document.getElementById('struk-game').innerText=trx.game_name;document.getElementById('struk-item').innerText=trx.item_name;document.getElementById('struk-price').innerText=price;modal.style.display='flex'}
function closeReceiptModal(){document.getElementById('receiptModal').style.display='none'}