// Definition for singly-linked list.
#[derive(PartialEq, Eq, Clone, Debug)]
pub struct ListNode {
  pub val: i32,
  pub next: Option<Box<ListNode>>
}

impl ListNode {
  #[inline]
  fn new(val: i32) -> Self {
    ListNode {
      next: None,
      val
    }
  }
}

pub fn add_two_numbers(l1: Option<Box<ListNode>>, l2: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
    let mut carry = false;
    let mut item1 = l1;
    let mut item2 = l2;
    let mut result: Option<Box<ListNode>> = None;
    let mut stack: Vec<Box<ListNode>> = vec![];
    loop {
        let sum = if let (Some(item_val1),Some(item_val2)) = (&item1,&item2) {
            match item_val1.val + item_val2.val {
                x if x > 9 => {
                    carry = true;
                    0
                },
                x if carry => {
                    x + 1
                },
                x => x
            }
        } else {
            break;
        };
        
        stack.push(Box::new(ListNode::new(sum)));
            
        item1 = item1?.next;
        item2 = item2?.next;
    }
    
    println!("{:?}", stack);
    
    stack.into_iter().for_each(|mut entry| {
        if let Some(current) = result.clone() {
            entry.next = Some(current);
            result = Some(entry)
        } else {
            result = Some(entry)
        }
    });
    result
}

fn main() {

}