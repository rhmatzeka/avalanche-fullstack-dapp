// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    address public owner;
    uint256 private storedValue;
    
    // State baru untuk Task 4: Todo List
    struct Todo {
        string task;
        bool isCompleted;
    }
    Todo[] public todos;

    event OwnerSet(address indexed oldOwner, address indexed newOwner);
    event ValueUpdated(uint256 newValue);
    // Event tambahan untuk Todo
    event TodoAdded(string task);

    constructor() {
        owner = msg.sender;
        emit OwnerSet(address(0), owner);
    }

    // Modifier Access Control
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // Task 4: Gunakan onlyOwner pada setValue
    // Sekarang hanya pemilik kontrak yang bisa mengubah angka ini
    function setValue(uint256 _value) public onlyOwner {
        storedValue = _value;
        emit ValueUpdated(_value);
    }

    // Task 4: Tambahkan state lain yang bisa diupdate (Todo List)
    function addTodo(string memory _task) public onlyOwner {
        todos.push(Todo({
            task: _task,
            isCompleted: false
        }));
        emit TodoAdded(_task);
    }

    // Fungsi helper untuk melihat jumlah todo
    function getTodoCount() public view returns (uint256) {
        return todos.length;
    }

    function getValue() public view returns (uint256) {
        return storedValue;
    }
}