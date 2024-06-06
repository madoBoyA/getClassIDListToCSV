import fs from 'fs';

const classList = []; // 클래스 리스트
const idList = []; // 아이디 리스트

// CSV 형식으로 변환하는 함수
function convertToCSV(data) {
	console.log(data)
	let a = data.map(row => {
		// console.log(typeof row)
		if (typeof row === "object") {

			return row.join(',')
		}
		else {
			return row
		}
	}).join('\n');
	console.log(a)
	return a
}

// 클래스 리스트와 아이디 리스트를 CSV 파일로 저장하는 함수
function saveListsToCSV(classList, idList) {
	const csvData = convertToCSV([[['Class'], ...classList], [['ID'], ...idList]]);
	const csvData2 = convertToCSV( [['ID'], ...idList]);
	fs.writeFileSync('lists.csv', csvData + csvData2, 'utf8');
	console.log('CSV 파일이 성공적으로 저장되었습니다.');
}

// 클래스 리스트와 아이디 리스트에 샘플 데이터 추가 (임의로 추가하거나 실제 데이터를 여기에 추가하세요)
classList.push('Class1', 'Class2', 'Class3');
idList.push('ID1', 'ID2', 'ID3');

// CSV 파일로 저장
saveListsToCSV(classList, idList);
