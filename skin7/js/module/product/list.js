document.addEventListener('DOMContentLoaded', function () {
    var urlParams = new URLSearchParams(window.location.search);
    var currentCateNo = urlParams.get('cate_no');

    if (!currentCateNo) {
        var matches = window.location.pathname.match(/\/(\d+)\/?$/);
        if (matches) currentCateNo = matches[1];
    }
    if (!currentCateNo) return;

    // cate_no가 66인 경우 body에 클래스 추가 (icon__box 숨김 처리용 등)
    if (currentCateNo === '66') {
        document.body.classList.add('cate-66');
    }

    var currentTitle = document.querySelector('.titleArea h2');
    var categoryName = currentTitle ? currentTitle.innerText.trim() : '전체';

    var breadcrumbs = document.querySelectorAll('.path ol li a');
    var catePath = [];
    breadcrumbs.forEach(function (el) {
        var href = el.getAttribute('href');
        var cNo = null;
        if (href) {
            if (href.indexOf('cate_no=') !== -1) {
                cNo = new URLSearchParams(href.split('?')[1]).get('cate_no');
            } else if (href.indexOf('/category/') !== -1) {
                var m = href.match(/\/(\d+)\/?$/);
                if (m) cNo = m[1];
            }
        }
        if (cNo) {
            catePath.push({ no: cNo, name: el.innerText.trim() });
        }
    });

    // Depth 1: 메인 카테고리 (예: 키오스크)
    // Depth 2: 2차 카테고리 (예: 삼성 스탠드)
    // Depth 3: 3차 카테고리 (예: 스탠드형)
    var depth1No = catePath.length > 0 ? catePath[0].no : currentCateNo;
    var depth2No = catePath.length > 1 ? catePath[1].no : null;
    
    // Cafe24 API에서 카테고리 트리 가져오기
    fetch('/exec/front/Product/SubCategory')
        .then(function (res) { return res.json(); })
        .then(function (aData) {
            if (!aData || aData.length === 0) return;

            // 1. 박스 형태 (2차 메뉴) 렌더링 리스트
            var tier1List = aData.filter(function (item) {
                return item.parent_cate_no == depth1No;
            });
            
            // (만약 최상단 클릭 등으로 하위가 없거나 다르게 잡히면 fallback)
            if (tier1List.length === 0) {
                tier1List = aData.filter(function(item) {
                    return item.parent_cate_no == currentCateNo;
                });
                depth1No = currentCateNo;
                depth2No = null;
            }

            // 2. 텍스트 형태 (3차 메뉴) 렌더링 리스트
            var tier2List = [];
            if (depth2No) {
                tier2List = aData.filter(function (item) {
                    return item.parent_cate_no == depth2No;
                });
            }

            // --- Box Layer (2차 메뉴) 렌더링 ---
            var html = '';
            
            // 특정 2차 카테고리 (삼성: 46, 엘지: 47, 티비존: 48) 일 때는 형제 메뉴를 숨기고 하위(3차) 메뉴만 가로 탭으로 노출
            var targetParents = ['46', '47', '48', '59'];
            var activeTargetNo = targetParents.includes(currentCateNo) ? currentCateNo : (targetParents.includes(depth2No) ? depth2No : null);

            // 카페24에 실제 하위 카테고리가 없는 경우를 위한 수동 지정 탭 (멀티비전/메뉴보드용 거치대)
            var manualSubTabs = {
                '59': [
                    { name: '멀티비전 거치대(매립형)', cate_no: '59', param: '?cate_no=59' },
                    { name: '메뉴보드용 거치대(천정형)', cate_no: '59', param: '?cate_no=59' }
                ]
            };

            if (activeTargetNo) {
                // 선택된 2차 카테고리의 3차 하위 메뉴만 탭으로 생성
                var mySubItems = aData.filter(function (sub) {
                    return sub.parent_cate_no == activeTargetNo;
                });

                if (mySubItems.length === 0 && manualSubTabs[activeTargetNo]) {
                    mySubItems = manualSubTabs[activeTargetNo];
                }

                if (mySubItems.length > 0) {
                    // 탭 형태로 가로 나열
                    html += '<li><a href="/product/list.html?cate_no=' + depth1No + '">전체</a></li>';
                    mySubItems.forEach(function (subItem) {
                        var isSubSelected = (currentCateNo == subItem.cate_no) ? 'class="selected"' : '';
                        html += '<li ' + isSubSelected + '><a href="/product/list.html' + (subItem.param || '?cate_no=' + subItem.cate_no) + '">' + subItem.name + '</a></li>';
                    });
                } else {
                    // 실제 하위 카테고리가 없으면(API 미반환) 탭이 텅 비지 않도록 형제 목록 방식으로 폴백
                    activeTargetNo = null;
                }
            }

            if (!activeTargetNo) {
                // 기존 로직: 전체 2차 메뉴 노출 + 하위 메뉴 수직 배열
                if (tier1List.length > 0) {
                    var isAllSelected = (currentCateNo == depth1No || (!depth2No && currentCateNo != depth1No)) ? 'class="selected"' : '';
                    html += '<li ' + isAllSelected + '><a href="/product/list.html?cate_no=' + depth1No + '">전체</a></li>';

                    tier1List.forEach(function (item) {
                        var isSelected = (depth2No == item.cate_no || currentCateNo == item.cate_no);
                        var selectedClass = isSelected ? 'class="selected"' : '';
                        
                        // 현재 아이템의 하위(3차) 카테고리를 aData에서 모두 찾기
                        // 단, 삼성/엘지/티비존 스탠드(46,47,48)는 '전체' 탭에서 하위(세로형/회전형) 노출 안 함
                        var mySubItems = targetParents.includes(String(item.cate_no)) ? [] : aData.filter(function (sub) {
                            return sub.parent_cate_no == item.cate_no;
                        });
                        
                        // 하위 메뉴 중 현재 페이지에 해당하는 것이 있는지 확인
                        var isSubMenuActive = mySubItems.some(function(subItem) {
                            return currentCateNo == subItem.cate_no;
                        });
                        
                        var openClass = isSubMenuActive ? ' is-open' : '';
                        html += '<li class="' + (isSelected ? 'selected' : '') + openClass + '" style="position: relative;">';
                        
                        if (mySubItems.length > 0) {
                            html += '<div class="parent-menu-wrapper" style="position: relative; width: 100%;">';
                            html += '<a href="/product/list.html' + (item.param || '?cate_no=' + item.cate_no) + '">' + item.name + '</a>';
                            html += '</div>';
                            
                            html += '<ul class="custom-tier2-box">';
                            mySubItems.forEach(function (subItem) {
                                var isSubSelected = (currentCateNo == subItem.cate_no) ? 'class="selected"' : '';
                                html += '<li ' + isSubSelected + '><a href="/product/list.html' + (subItem.param || '?cate_no=' + subItem.cate_no) + '">' + subItem.name + '</a></li>';
                            });
                            html += '</ul>';
                        } else {
                            html += '<a href="/product/list.html' + (item.param || '?cate_no=' + item.cate_no) + '">' + item.name + '</a>';
                        }
                        
                        html += '</li>';
                    });
                }
            }
            
            var box = document.getElementById('dynamic-subcategory-box');
            if (box) {
                box.innerHTML = html;
                
                // 토글 기능이 삭제되어 항상 노출됩니다.
            }
        })
        .catch(function (err) {
            console.error('SubCategory Fetch Error:', err);
        });
});
