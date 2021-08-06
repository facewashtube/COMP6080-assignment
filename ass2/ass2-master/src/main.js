import API from './api.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');

// Example usage of makeAPIRequest method.
//api.makeAPIRequest('dummy/user')
//    .then(r => console.log(r));


//localStorage.clear()

console.log('start')
var page_now=0
var return_page=0

const loadfeed=()=>{
	page_now=1
	const get_feed=fetch('http://localhost:5000/user/feed?p-0&n-10',{
		method:'GET',
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Token '+localStorage['token_name']
		},
		}).then((data)=>{
			if(data.status===403){
				a_content.innerText='Invalid Auth Token'
				modal.classList.add("show-modal");
			}else if(data.status===200){
				data.json().then(result=>{
					const posts=result['posts']
					get_user_info()
					posts.map(post=>{
						localStorage.setItem('name',post.meta.author)
						localStorage.setItem('post_id',post['id'])
						get_post_info()
						const box=document.createElement('div');
						box.Name='new_box'
						box.id='mydiv'

						const get_post=fetch('http://localhost:5000/post?id='+post['id'],{
							method:'GET',
							headers:{
								'Accept': 'application/json',
								'Content-Type': 'application/json',
								'Authorization': 'Token '+localStorage['token_name']
							},
							}).then((data)=>{
								if(data.status===403){
									a_content.innerText='Invalid Auth Token'
									modal.classList.add("show-modal");
								}else if(data.status===404){
									a_content.innerText='Post Not Found'
									modal.classList.add("show-modal");
								}else if(data.status===400){
									a_content.innerText='Malformed Request'
									modal.classList.add("show-modal");
								}else if(data.status===200){
									data.json().then(result=>{
										localStorage.setItem('post_id',post['id'])
										const postbox=document.createElement('div');
										postbox.innerText='By: ';
										box.appendChild(postbox);
										const profile1=document.createElement('input');
										profile1.type='button';
										profile1.value=post.meta.author
										box.appendChild(profile1);

										profile1.addEventListener('click',()=>
										{	
											localStorage.setItem('post_id',post['id'])
											localStorage.setItem('name',post.meta.author)
											show_profile1()
										});

										const innt=result.meta.published
										var date = new Date(innt*1000);
							            var Y = date.getFullYear() + '-';
							            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
							            var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
							            var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
							            var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
							            var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());

							            let strDate=Y+M+D+h+m+s
							            const data=document.createElement('div');
										data.innerText='posted date: '+strDate
										box.appendChild(data);

										//localStorage.setItem(post['id'],localStorage['user'])

										const pic=document.createElement('img');
										const p1='data:image/png;base64,'
										const p2=p1+post.thumbnail
										pic.setAttribute('src',p2);
										box.appendChild(pic);

										const like=document.createElement('div');
										like.innerText='like_num: '+post.meta.likes.length
										box.appendChild(like);
										const likeby=document.createElement('div');
										likeby.innerText='liked By: '
										likeby.id='mydiv'
										const like_list_id=result.meta.likes
										let len_list=like_list_id.length
										if (len_list==0){
											likeby.innerText=likeby.innerText+'None'
										}else{
											let len_like=len_list-1
											while(len_like>=0){
												let iden=like_list_id[len_like]
												localStorage.setItem('now_which',iden)
												const get_follow=fetch('http://localhost:5000/user?id='+iden,{
													method:'GET',
													headers:{
														'Accept': 'application/json',
														'Content-Type': 'application/json',
														'Authorization': 'Token '+localStorage['token_name']
													},
													}).then((data)=>{
														if(data.status===403){
															a_content.innerText='Invalid Auth Token'
															modal.classList.add("show-modal");
														}else if(data.status===404){
															a_content.innerText='User Not Found'
															modal.classList.add("show-modal");
														}else if(data.status===400){
															a_content.innerText='Malformed Request'
															modal.classList.add("show-modal");
														}else if(data.status===200){
															data.json().then(result=>{
																let str1=result.name
																localStorage['iden',str1]
															})
														}
													})

												likeby.innerText=likeby.innerText+localStorage[iden]+','
												len_like-=1
											}
										}
										box.appendChild(likeby);

										const postbox2=document.createElement('div');
										postbox2.innerText='post-content: '+post.meta.description_text;
										box.appendChild(postbox2);
										
										const like_btn=document.createElement('input');
										like_btn.type='button';
										like_btn.value='like it!'
										box.appendChild(like_btn);
										
										like_btn.addEventListener('click',()=>
										{	
											localStorage.setItem('like_id',post['id'])
											advancedfeed_like()
										});

										const unlike_btn=document.createElement('input');
										unlike_btn.type='button';
										unlike_btn.value='unlike it!'
										box.appendChild(unlike_btn);
										unlike_btn.addEventListener('click',()=>
										{	
											localStorage.setItem('unlike_id',post['id'])
											advancedfeed_unlike()
										});

										const comments=document.createElement('div');
										comments.innerText='comments: '+post.comments.length
										box.appendChild(comments);
										const len_comm=result.comments.length
										if (len_comm!=0){
											const show_comments=document.createElement('div');
											show_comments.innerText='Comments-content: '
											let len_co=len_comm-1
											while (len_co>=0){
												let str1=result.comments[len_co]['comment']
												const label=len_comm-len_co;
												show_comments.innerText=show_comments.innerText+str1+'; '
												len_co-=1
											}
										box.appendChild(show_comments);
										}

										const post_comments=document.createElement('input');
										post_comments.placeholder='share your thoughts'
										box.appendChild(post_comments);
										const comment_btn=document.createElement('input');
										comment_btn.type='button';
										comment_btn.value='submit comment'
										box.appendChild(comment_btn);
										comment_btn.addEventListener('click',()=>
										{	
											localStorage.setItem('comment_id',post['id'])
											localStorage.setItem('comment',post_comments.value)
											leave_comment()
										});


										})
										const kong=document.createElement('div');
										kong.innerText='\n'
										box.appendChild(kong);
									}
								})
						document.getElementById("posting").appendChild(box);
					})
				})
			}
		})
}

const showfeed=()=>{
	document.getElementById("login_page").style.display='none';
	document.getElementById("login_feed").style.display='block';
	document.getElementById("profile").style.display='none';
	document.getElementById("up_profile").style.display='none';
	loadfeed()
}

const hidefeed=()=>{
	document.getElementById("login_page").style.display='block';
	document.getElementById("login_feed").style.display='none';
	document.getElementById("profile").style.display='none';
	document.getElementById("up_profile").style.display='none';
	let removeObj=document.getElementById("mydiv")
	while(removeObj){
		removeObj.parentNode.removeChild(removeObj)
		removeObj=document.getElementById("mydiv")
	}
	let removeObj2=document.getElementById("mydiv2")
	while(removeObj2){
		removeObj2.parentNode.removeChild(removeObj2)
		removeObj2=document.getElementById("mydiv2")
	}
	let removeObj3=document.getElementById("mydiv3")
	while(removeObj3){
		removeObj3.parentNode.removeChild(removeObj3)
		removeObj3=document.getElementById("mydiv3")
	}
	let removeObj4=document.getElementById("mydiv4")
	while(removeObj4){
		removeObj4.parentNode.removeChild(removeObj4)
		removeObj4=document.getElementById("mydiv4")
	}
}


document.getElementById("log_out").addEventListener('click',()=>{
	hidefeed();
})

document.getElementById("return").addEventListener('click',()=>{
	if (page_now==0){
		hidefeed();
	}else if(page_now==1){
		hidefeed()
	}else if(page_now==2){
		document.getElementById("login_page").style.display='none';
		document.getElementById("profile").style.display='none';
		document.getElementById("up_profile").style.display='none';
		document.getElementById("login_feed").style.display='block';
		page_now=1
		return_page=1
		let removeObj=document.getElementById("mydiv")
		while(removeObj){
			removeObj.parentNode.removeChild(removeObj)
			removeObj=document.getElementById("mydiv")
		}
		let removeObj2=document.getElementById("mydiv2")
		while(removeObj2){
			removeObj2.parentNode.removeChild(removeObj2)
			removeObj2=document.getElementById("mydiv2")
		}
		let removeObj3=document.getElementById("mydiv3")
		while(removeObj3){
			removeObj3.parentNode.removeChild(removeObj3)
			removeObj3=document.getElementById("mydiv3")
		}
		loadfeed()

	}
})



const close = document.getElementById("close");
const modal = document.getElementById("modal");
const submit1 = document.getElementById("submit1");
const submit2 = document.getElementById("submit2");
const a_content= document.getElementById("alert");
const login=document.forms.Login; 
const reg=document.forms.reg;

submit1.addEventListener("click",()=>
	{
		const name=login.elements.user_name.value;
		const password_1=login.elements.password_1.value
		const password_2=login.elements.password_2.value
		if (password_1!=password_2){
			a_content.innerText='password not match'
			modal.classList.add("show-modal");
		}else{
			const login_content={
				'username': name,
				'password': password_1,
			};
			const response_login=fetch('http://localhost:5000/auth/login',{
				method:'POST',
				headers:{
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(login_content),
			}).then((data)=>{
				if(data.status===403){
					a_content.innerText='Invalid Username/Password'
					modal.classList.add("show-modal");
				}else if(data.status===200){
					data.json().then(result=>{
						const token=result.token
						localStorage.setItem('token_name',token)
						showfeed()
					})
				}else{
					a_content.innerText='Missing Username/Password'
					modal.classList.add("show-modal");
				}
			})
		}
	});
submit2.addEventListener("click",()=>
	{
		const name=reg.elements.user_name.value;
		const password_1=reg.elements.password_1.value
		const password_2=reg.elements.password_2.value
		const email=reg.elements.email.value
		const name1=reg.elements.name1.value
		if (password_1!=password_2){
			a_content.innerText='password not match'
			modal.classList.add("show-modal");
		}else{
			const reg_content={
				'username': name,
				'password': password_1,
				'email': email,
				'name': name1
			};
			const response_login=fetch('http://localhost:5000/auth/signup',{
				method:'POST',
				headers:{
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(reg_content),
			}).then((data)=>{
				if(data.status===409){
					a_content.innerText='Username Taken'
					modal.classList.add("show-modal");
				}else if(data.status===200){
					data.json().then(result=>{
						const token=result.token
						localStorage.setItem('token_name',token)
						showfeed()
					})
				}else{
					a_content.innerText='Missing Username/Password'
					modal.classList.add("show-modal");
				}
			})
		}
	});
close.addEventListener("click",()=>
	{
		modal.classList.remove("show-modal");
	});

const advancedfeed_add_post=()=>{
	const add_content={
		"description_text": localStorage['text'],
		"src": localStorage['file'],
	}
	const post_ad=fetch('http://localhost:5000/post',{
		method:'POST',
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Token '+localStorage['token_name']
		},
		body: JSON.stringify(add_content),
		}).then((data)=>{
			if(data.status===403){
				a_content.innerText='Invalid Auth Token'
				modal.classList.add("show-modal");
			}else if(data.status===400){
				a_content.innerText='Malformed Request / Image could not be processed'
				modal.classList.add("show-modal");
			}else if(data.status===200){
				a_content.innerText='Success add post!'
				modal.classList.add("show-modal");
				data.json().then(result=>{
					console.log('add post')
				})
			}
		})
}



const advancedfeed_del_post=()=>{
	const post_ad=fetch('http://localhost:5000/post?id='+localStorage['post_id'],{
		method:'DELETE',
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Token '+localStorage['token_name']
		},
		}).then((data)=>{
			if(data.status===403){
				a_content.innerText='Invalid Auth Token'
				modal.classList.add("show-modal");
			}else if(data.status===400){
				a_content.innerText='Malformed Request'
				modal.classList.add("show-modal");
			}else if(data.status===404){
				a_content.innerText='Post Not Found'
				modal.classList.add("show-modal");
			}else if(data.status===200){
				a_content.innerText='Success delete post!'
				modal.classList.add("show-modal");
				data.json().then(result=>{
					console.log('add post')
				})
			}
		})
}

const advancedfeed_update_post=()=>{
	const up_content={
		"description_text": localStorage['info'],
		"src": localStorage['src'],
	}
	const post_ad=fetch('http://localhost:5000/post?id='+localStorage['post_id'],{
		method:'PUT',
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Token '+localStorage['token_name']
		},
		body: JSON.stringify(up_content),
		}).then((data)=>{
			if(data.status===403){
				a_content.innerText='Invalid Auth Token / Unauthorized to edit Post'
				modal.classList.add("show-modal");
			}else if(data.status===400){
				a_content.innerText='Malformed Request'
				modal.classList.add("show-modal");
			}else if(data.status===404){
				a_content.innerText='Post Not Found'
				modal.classList.add("show-modal");
			}else if(data.status===200){
				a_content.innerText='success update'
				modal.classList.add("show-modal");
			}
		})
}

const leave_comment=()=>{
	const comment_content={
		"comment": localStorage['comment']
	}
	const leave_c=fetch('http://localhost:5000/post/comment?id='+localStorage['comment_id'],{
		method:'PUT',
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Token '+localStorage['token_name']
		},
		body: JSON.stringify(comment_content),
		}).then((data)=>{
			if(data.status===403){
				a_content.innerText='Invalid Auth Token'
				modal.classList.add("show-modal");
			}else if(data.status===404){
				a_content.innerText='Post Not Found'
				modal.classList.add("show-modal");
			}else if(data.status===400){
				a_content.innerText='Malformed Request'
				modal.classList.add("show-modal");
			}else if(data.status===200){
				a_content.innerText='Success commented'
				modal.classList.add("show-modal");
				document.getElementById("login_page").style.display='none';
				document.getElementById("profile").style.display='none';
				document.getElementById("up_profile").style.display='none';
				document.getElementById("login_feed").style.display='block';
				page_now=1
				let removeObj=document.getElementById("mydiv")
				while(removeObj){
					removeObj.parentNode.removeChild(removeObj)
					removeObj=document.getElementById("mydiv")
				}
				let removeObj2=document.getElementById("mydiv2")
				while(removeObj2){
					removeObj2.parentNode.removeChild(removeObj2)
					removeObj2=document.getElementById("mydiv2")
				}
				let removeObj3=document.getElementById("mydiv3")
				while(removeObj3){
					removeObj3.parentNode.removeChild(removeObj3)
					removeObj3=document.getElementById("mydiv3")
				}
				loadfeed()
				data.json().then(result=>{
					console.log('commented')
				})
			}
		})
}


const advancedfeed_like=()=>{
	const add_like=fetch('http://localhost:5000/post/like?id='+localStorage['like_id'],{
		method:'PUT',
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Token '+localStorage['token_name']
		},
		}).then((data)=>{
			if(data.status===403){
				a_content.innerText='Invalid Auth Token'
				modal.classList.add("show-modal");
			}else if(data.status===404){
				a_content.innerText='Post Not Found'
				modal.classList.add("show-modal");
			}else if(data.status===400){
				a_content.innerText='Malformed Request'
				modal.classList.add("show-modal");
			}else if(data.status===200){
				a_content.innerText='Success like!'
				modal.classList.add("show-modal");
				document.getElementById("login_page").style.display='none';
				document.getElementById("profile").style.display='none';
				document.getElementById("up_profile").style.display='none';
				document.getElementById("login_feed").style.display='block';
				page_now=1
				let removeObj=document.getElementById("mydiv")
				while(removeObj){
					removeObj.parentNode.removeChild(removeObj)
					removeObj=document.getElementById("mydiv")
				}
				let removeObj2=document.getElementById("mydiv2")
				while(removeObj2){
					removeObj2.parentNode.removeChild(removeObj2)
					removeObj2=document.getElementById("mydiv2")
				}
				let removeObj3=document.getElementById("mydiv3")
				while(removeObj3){
					removeObj3.parentNode.removeChild(removeObj3)
					removeObj3=document.getElementById("mydiv3")
				}
				loadfeed()
				data.json().then(result=>{
					console.log('liked')
				})
			}
		})
}

const advancedfeed_unlike=()=>{
	const un_like=fetch('http://localhost:5000/post/unlike?id='+localStorage['unlike_id'],{
		method:'PUT',
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Token '+localStorage['token_name']
		},
		}).then((data)=>{
			if(data.status===403){
				a_content.innerText='Invalid Auth Token'
				modal.classList.add("show-modal");
			}else if(data.status===404){
				a_content.innerText='Post Not Found'
				modal.classList.add("show-modal");
			}else if(data.status===400){
				a_content.innerText='Malformed Request'
				modal.classList.add("show-modal");
			}else if(data.status===200){
				a_content.innerText='Success unlike!'
				modal.classList.add("show-modal");
				document.getElementById("login_page").style.display='none';
				document.getElementById("profile").style.display='none';
				document.getElementById("up_profile").style.display='none';
				document.getElementById("login_feed").style.display='block';
				page_now=1
				let removeObj=document.getElementById("mydiv")
				while(removeObj){
					removeObj.parentNode.removeChild(removeObj)
					removeObj=document.getElementById("mydiv")
				}
				let removeObj2=document.getElementById("mydiv2")
				while(removeObj2){
					removeObj2.parentNode.removeChild(removeObj2)
					removeObj2=document.getElementById("mydiv2")
				}
				let removeObj3=document.getElementById("mydiv3")
				while(removeObj3){
					removeObj3.parentNode.removeChild(removeObj3)
					removeObj3=document.getElementById("mydiv3")
				}
				loadfeed()
				data.json().then(result=>{
					console.log('unliked')
				})
			}
		})
}

const advancedfeed_follow=()=>{
	const follow_ad=fetch('http://localhost:5000/user/follow?username='+localStorage['name'],{
		method:'PUT',
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Token '+localStorage['token_name']
		},
		}).then((data)=>{
			if(data.status===403){
				a_content.innerText='Invalid Auth Token'
				modal.classList.add("show-modal");
			}else if(data.status===404){
				a_content.innerText='User Not Found'
				modal.classList.add("show-modal");
			}else if(data.status===400){
				a_content.innerText='Malformed Request'
				modal.classList.add("show-modal");
			}else if(data.status===200){
				a_content.innerText='success follow'
				modal.classList.add("show-modal");
				data.json().then(result=>{
					console.log('follow')
				})
			}
		})
}

const advancedfeed_unfollow=()=>{
	const unfollow_ad=fetch('http://localhost:5000/user/unfollow?username='+localStorage['name'],{
		method:'PUT',
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Token '+localStorage['token_name']
		},
		}).then((data)=>{
			if(data.status===403){
				a_content.innerText='Invalid Auth Token'
				modal.classList.add("show-modal");
			}else if(data.status===400){
				a_content.innerText='Malformed Request'
				modal.classList.add("show-modal");
			}else if(data.status===200){
				a_content.innerText='success unfollow'
				modal.classList.add("show-modal");
				data.json().then(result=>{
					console.log('unfollow')
				})
			}
		})
}

const get_user_info=()=>{
	const get_user_infooo=fetch('http://localhost:5000/user/',{
		method:'GET',
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Token '+localStorage['token_name']
		},
		}).then((data)=>{
			if(data.status===403){
				a_content.innerText='Invalid Auth Token'
				modal.classList.add("show-modal");
			}else if(data.status===404){
				a_content.innerText='User Not Found'
				modal.classList.add("show-modal");
			}else if(data.status===400){
				a_content.innerText='Malformed Request'
				modal.classList.add("show-modal");
			}else if(data.status===200){
				data.json().then(result=>{
					localStorage.setItem('user',result.username)
					localStorage.setItem(result.id,result.username)
					const p_btn=document.createElement('input');
					p_btn.type='button';
					p_btn.value=result.username
					p_btn.id='mydiv2'
					document.getElementById("profile_btn").appendChild(p_btn);	
					p_btn.addEventListener('click',()=>
					{	
						localStorage.setItem('name',result.username)
						show_profile1()
					});

					const up_pro_btn=document.createElement('input');
					up_pro_btn.type='button';
					up_pro_btn.value='update profile'
					up_pro_btn.id='mydiv2'
					document.getElementById("profile_btn").appendChild(up_pro_btn);	
					up_pro_btn.addEventListener('click',()=>
					{	
						localStorage.setItem('name',result.username)
						update_profile()
					});

					const follow_who=document.createElement('input');
					follow_who.id='mydiv2'
					follow_who.placeholder='input name follow'
					document.getElementById("follow_btn").appendChild(follow_who);	

					const f_btn=document.createElement('input');
					f_btn.type='button';
					f_btn.value='follow'
					f_btn.id='mydiv2'
					document.getElementById("follow_btn").appendChild(f_btn);	
					f_btn.addEventListener('click',()=>
					{	
						localStorage.setItem('name',follow_who.value)
						advancedfeed_follow()     
					});

					const unfollow_who=document.createElement('input');
					unfollow_who.id='mydiv3'
					unfollow_who.placeholder='input name unfollow'
					document.getElementById("unfollow_btn").appendChild(unfollow_who);	

					const uf_btn=document.createElement('input');
					uf_btn.type='button';
					uf_btn.value='unfollow'
					uf_btn.id='mydiv3'
					document.getElementById("unfollow_btn").appendChild(uf_btn);	
					uf_btn.addEventListener('click',()=>
					{	
						localStorage.setItem('name',unfollow_who.value)
						advancedfeed_unfollow()
					});

					const box6=document.createElement('div');
					box6.id='mydiv3'

					const add=document.createElement('input');
					add.placeholder='Create a new post now!'

					box6.appendChild(add);	
	
					const add2=document.createElement('input');
					add2.type='file'
					add2.addEventListener('change',(event)=>{
						const reader=new FileReader()
						fileToDataUrl(event.target.files[0])
						.then(result=>{
							result=result.substr(22,)
							localStorage['file']=result
						})
					})
					box6.appendChild(add2);

					const add_btn=document.createElement('input');
					add_btn.type='button';
					add_btn.value='add post'
					box6.appendChild(add_btn);
					add_btn.addEventListener('click',()=>
					{	
						localStorage.setItem('name',result.username)
						localStorage.setItem('text',add.value)
						
						advancedfeed_add_post()
					});

					document.getElementById("posting2").appendChild(box6);	



				})
			}
		})
	}

const get_post_info=()=>{
	const get_post=fetch('http://localhost:5000/post?id='+localStorage['post_id'],{
	method:'GET',
	headers:{
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'Authorization': 'Token '+localStorage['token_name']
	},
	}).then((data)=>{
		if(data.status===403){
			a_content.innerText='Invalid Auth Token'
			modal.classList.add("show-modal");
		}else if(data.status===404){
			a_content.innerText='Post Not Found'
			modal.classList.add("show-modal");
		}else if(data.status===400){
			a_content.innerText='Malformed Request'
			modal.classList.add("show-modal");
		}else if(data.status===200){
			data.json().then(result=>{
				console.log('ok')
			})
		}
	})
}

const get_user_page=()=>{
	page_now=2
	if (return_page==1){
		let removeObj5=document.getElementById("mydiv5")
		while(removeObj5){
			removeObj5.parentNode.removeChild(removeObj5)
			removeObj5=document.getElementById("mydiv5")
		}
	}
	const get_user_infoo=fetch('http://localhost:5000/user?username='+localStorage['name'],{
		method:'GET',
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Token '+localStorage['token_name']
		},
		}).then((data)=>{
			if(data.status===403){
				a_content.innerText='Invalid Auth Token'
				modal.classList.add("show-modal");
			}else if(data.status===404){
				a_content.innerText='User Not Found'
				modal.classList.add("show-modal");
			}else if(data.status===400){
				a_content.innerText='Malformed Request'
				modal.classList.add("show-modal");
			}else if(data.status===200){
				data.json().then(result=>{
					document.getElementById("login_page").style.display='none';
					document.getElementById("login_feed").style.display='none';
					document.getElementById("profile").style.display='block';		

					const box2=document.createElement('div');
					box2.Name='new_box2'
					box2.id='mydiv5'

					const uname=document.createElement('div');
					uname.innerText='username: '+result.username
					box2.appendChild(uname);
					document.getElementById("profile").appendChild(box2);

					const name=document.createElement('div');
					name.innerText='name: '+result.name
					box2.appendChild(name);
					document.getElementById("profile").appendChild(box2);

					const email=document.createElement('div');
					email.innerText='email: '+result.email
					box2.appendChild(email);

					const followed_num=document.createElement('div');
					followed_num.innerText='followed_num: '+result.followed_num
					box2.appendChild(followed_num);

					const following_num=document.createElement('div');
					following_num.innerText='following_num: '+result.following.length
					box2.appendChild(following_num);

					const follow_list=result.following;
					const len_follow=follow_list.length
					
					if (len_follow!=0){
						const show_follow=document.createElement('div');
						show_follow.innerText='following-these-users: '
						let len_co=len_follow-1
						while (len_co>=0){
							const get_follow=fetch('http://localhost:5000/user?id='+follow_list[len_co],{
								method:'GET',
								headers:{
									'Accept': 'application/json',
									'Content-Type': 'application/json',
									'Authorization': 'Token '+localStorage['token_name']
								},
								}).then((data)=>{
									if(data.status===403){
										a_content.innerText='Invalid Auth Token'
										modal.classList.add("show-modal");
									}else if(data.status===404){
										a_content.innerText='User Not Found'
										modal.classList.add("show-modal");
									}else if(data.status===400){
										a_content.innerText='Malformed Request'
										modal.classList.add("show-modal");
									}else if(data.status===200){
										data.json().then(result=>{
											let str1=result.name
											show_follow.innerText=show_follow.innerText+str1+'; '
										})
									}
								})
								len_co-=1
							}
							box2.appendChild(show_follow);
						}else{
								const show_follow2=document.createElement('div');
								show_follow2.innerText='following-these-users: None '
								box2.appendChild(show_follow2);
							}

					const post_list=result.posts;
					const len_post=result.posts.length
					if (len_post!=0){
						const show_posts=document.createElement('div');
						show_posts.id='show'
						let len_co=len_post-1
						while (len_co>=0){
							const get_post=fetch('http://localhost:5000/post?id='+post_list[len_co],{
								method:'GET',
								headers:{
									'Accept': 'application/json',
									'Content-Type': 'application/json',
									'Authorization': 'Token '+localStorage['token_name']
								},
								}).then((data)=>{
									if(data.status===403){
										a_content.innerText='Invalid Auth Token'
										modal.classList.add("show-modal");
									}else if(data.status===404){
										a_content.innerText='Post Not Found'
										modal.classList.add("show-modal");
									}else if(data.status===400){
										a_content.innerText='Malformed Request'
										modal.classList.add("show-modal");
									}else if(data.status===200){
										data.json().then(result=>{
										
											let str1=result.meta.description_text;
											const show1=document.createElement('div');
											show1.innerText=str1
											document.getElementById('show').appendChild(show1)

											const picc=document.createElement('img');
											const p11='data:image/png;base64,'
											const p22=p11+result.thumbnail
											picc.setAttribute('src',p22);
											document.getElementById('show').appendChild(picc)

											let del_btn=document.createElement('input');
											del_btn.type='button';
											del_btn.value='delete post'
											document.getElementById('show').appendChild(del_btn)
											del_btn.addEventListener('click',()=>
											{	
												localStorage.setItem('post_id',result.id)
												advancedfeed_del_post()
											});

											const up_post=document.createElement('input');
											up_post.placeholder='update your thoughts'
											document.getElementById('show').appendChild(up_post)

											let update_btn=document.createElement('input');
											update_btn.type='button';
											update_btn.value='update post'
											document.getElementById('show').appendChild(update_btn)
											update_btn.addEventListener('click',()=>
											{	
												localStorage.setItem('info',up_post.value)
												localStorage.setItem('post_id',result.id)
												localStorage.setItem('src',result.src)
												advancedfeed_update_post()
											});
										})
									}
								})
							len_co-=1
						}
						box2.appendChild(show_posts);
					}				

					document.getElementById("profile").appendChild(box2);

				})
			}
		})
	}


const get_update_page=()=>{
	page_now=2
	if (return_page==1){
		let removeObj4=document.getElementById("mydiv4")
		while(removeObj4){
			removeObj4.parentNode.removeChild(removeObj4)
			removeObj4=document.getElementById("mydiv4")
		}
	}
	const box3=document.createElement('div');
	box3.id='mydiv4'

	const up_email=document.createElement('input');
	up_email.placeholder='update email'
	box3.appendChild(up_email);	

	const up_name=document.createElement('input');
	up_name.placeholder='update name'
	box3.appendChild(up_name);	

	const up_password=document.createElement('input');
	up_password.placeholder='update password'
	box3.appendChild(up_password);	

	document.getElementById("up_profile").appendChild(box3);
	document.getElementById("login_page").style.display='none';
	document.getElementById("login_feed").style.display='none';
	document.getElementById("profile").style.display='none';
	document.getElementById("up_profile").style.display='block';
	const butt=document.createElement('input');
	butt.type='button'
	butt.value='submit'
	box3.appendChild(butt);
	butt.addEventListener('click',()=>{
		const cc={
			  "email": up_email.value,
			  "name":up_name.value ,
			  "password": up_password.value
				}
		const updating=fetch('http://localhost:5000/user',{
			method:'PUT',
			headers:{
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Token '+localStorage['token_name']
			},
			body: JSON.stringify(cc),
			}).then((data)=>{
				if(data.status===403){
					a_content.innerText='Invalid Auth Token'
					modal.classList.add("show-modal");
				}else if(data.status===400){
					a_content.innerText='Malformed Request'
					modal.classList.add("show-modal");
				}else if(data.status===200){
					a_content.innerText='update success'
					modal.classList.add("show-modal");
				}
			})

	})	
}

const show_profile1=()=>{
	document.getElementById("login_page").style.display='none';
	document.getElementById("login_feed").style.display='none';
	document.getElementById("profile").style.display='block';
	document.getElementById("up_profile").style.display='none';
	get_user_page()
}

const update_profile=()=>{
	document.getElementById("login_page").style.display='none';
	document.getElementById("login_feed").style.display='none';
	document.getElementById("profile").style.display='block';
	document.getElementById("up_profile").style.display='none';
	get_update_page()
}










